const { getBuckets } = require("./s3Service");
const { getEC2Instances } = require("./ec2Service");
const { iamClient, cloudTrailClient } = require("../awsConfig");

const { GetAccountSummaryCommand } = require("@aws-sdk/client-iam");
const { DescribeTrailsCommand } = require("@aws-sdk/client-cloudtrail");

async function runCISChecks() {
  try {
    const results = [];

    const buckets = await getBuckets();

    // Check 1
    const publicBuckets = buckets.filter(b => b.public);

    results.push({
      check: "S3 buckets should not be public",
      status: publicBuckets.length === 0 ? "PASS" : "FAIL",
      evidence: publicBuckets
    });

    // Check 2
    const unencrypted = buckets.filter(b => !b.encrypted);

    results.push({
      check: "S3 buckets should be encrypted",
      status: unencrypted.length === 0 ? "PASS" : "FAIL",
      evidence: unencrypted
    });

    // Check 3 Root MFA
    const summary = await iamClient.send(
      new GetAccountSummaryCommand({})
    );

    const mfaEnabled =
      summary.SummaryMap.AccountMFAEnabled === 1;

    results.push({
      check: "Root account MFA enabled",
      status: mfaEnabled ? "PASS" : "FAIL"
    });

    // Check 4 CloudTrail
    const trails = await cloudTrailClient.send(
      new DescribeTrailsCommand({})
    );

    results.push({
      check: "CloudTrail enabled",
      status: trails.trailList.length > 0 ? "PASS" : "FAIL"
    });

    // Check 5 EC2 SSH exposure
    const instances = await getEC2Instances();

    const openSSH = instances.filter(i =>
      i.securityGroups.includes("0.0.0.0/0")
    );

    results.push({
      check: "Security groups should not allow SSH from 0.0.0.0/0",
      status: openSSH.length === 0 ? "PASS" : "FAIL"
    });

    return results;
  } catch (error) {
    console.error("Error running CIS checks:", error.message);
    throw error;
  }
}

module.exports = { runCISChecks };
