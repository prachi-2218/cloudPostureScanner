const {
  ListBucketsCommand,
  GetBucketLocationCommand,
  GetBucketEncryptionCommand,
  GetBucketAclCommand,
  GetBucketPolicyStatusCommand,
  GetPublicAccessBlockCommand
} = require("@aws-sdk/client-s3");

const { s3Client } = require("../awsConfig");

async function checkBucketPublicAccess(bucketName) {
  try {
    // Check Public Access Block configuration
    let publicBlockConfig = null;
    try {
      const blockResponse = await s3Client.send(
        new GetPublicAccessBlockCommand({ Bucket: bucketName })
      );
      publicBlockConfig = blockResponse.PublicAccessBlockConfiguration;
    } catch (error) {
      // Public access block not configured - proceed with other checks
    }

    // If public access block is enabled and restrictive, bucket is not public
    if (publicBlockConfig && 
        (publicBlockConfig.BlockPublicAcls || 
         publicBlockConfig.BlockPublicPolicy || 
         publicBlockConfig.IgnorePublicAcls || 
         publicBlockConfig.RestrictPublicBuckets)) {
      return false;
    }

    // Check bucket policy for public access
    try {
      const policyStatus = await s3Client.send(
        new GetBucketPolicyStatusCommand({ Bucket: bucketName })
      );
      if (policyStatus.PolicyStatus.IsPublic) {
        return true;
      }
    } catch (error) {
      // No bucket policy or can't access it
    }

    // Check bucket ACL for public access
    try {
      const acl = await s3Client.send(
        new GetBucketAclCommand({ Bucket: bucketName })
      );
      
      // Check for public grants
      const publicGrants = acl.Grants.filter(grant => 
        grant.Grantee.Type === 'Group' && 
        (grant.Grantee.URI === 'http://acs.amazonaws.com/groups/global/AllUsers' ||
         grant.Grantee.URI === 'http://acs.amazonaws.com/groups/global/AuthenticatedUsers')
      );
      
      if (publicGrants.length > 0) {
        return true;
      }
    } catch (error) {
      // Can't access ACL
    }

    return false;
  } catch (error) {
    console.error(`Error checking public access for bucket ${bucketName}:`, error.message);
    return false; // Default to not public on error
  }
}

async function getBuckets() {
  try {
    const bucketsData = await s3Client.send(new ListBucketsCommand({}));

    const buckets = [];

    for (let bucket of bucketsData.Buckets) {
      let region = "unknown";
      let encrypted = false;
      let isPublic = false;

      try {
        const loc = await s3Client.send(
          new GetBucketLocationCommand({ Bucket: bucket.Name })
        );
        region = loc.LocationConstraint || "us-east-1";
      } catch (error) {
        console.error(`Error getting location for bucket ${bucket.Name}:`, error.message);
      }

      try {
        await s3Client.send(
          new GetBucketEncryptionCommand({ Bucket: bucket.Name })
        );
        encrypted = true;
      } catch (error) {
        // Bucket is not encrypted
      }

      try {
        isPublic = await checkBucketPublicAccess(bucket.Name);
      } catch (error) {
        console.error(`Error checking public access for bucket ${bucket.Name}:`, error.message);
      }

      buckets.push({
        bucketName: bucket.Name,
        region,
        encrypted,
        public: isPublic
      });
    }

    return buckets;
  } catch (error) {
    console.error("Error fetching S3 buckets:", error.message);
    if (error.name === 'UnauthorizedOperation') {
      throw new Error("AWS credentials lack S3 read permissions. Please attach AmazonS3ReadOnlyAccess policy and additional permissions for bucket ACL, policy, and public access block checks.");
    }
    throw error;
  }
}

module.exports = { getBuckets };
