const { DescribeInstancesCommand } = require("@aws-sdk/client-ec2");
const awsConfig = require("../awsConfig");
const { ec2Client } = awsConfig;

async function getEC2Instances() {
  try {
    const command = new DescribeInstancesCommand({});
    const data = await ec2Client.send(command);

    const instances = [];

    data.Reservations.forEach(res => {
      res.Instances.forEach(instance => {

        instances.push({
          instanceId: instance.InstanceId,
          type: instance.InstanceType,
          region: instance.Placement.AvailabilityZone,
          publicIp: instance.PublicIpAddress || "N/A",
          securityGroups: instance.SecurityGroups.map(g => g.GroupName)
        });

      });
    });

    return instances;
  } catch (error) {
    console.error("Error fetching EC2 instances:", error.message);
    if (error.name === 'UnauthorizedOperation') {
      throw new Error("AWS credentials lack EC2 read permissions. Please attach AmazonEC2ReadOnlyAccess policy.");
    }
    throw error;
  }
}

module.exports = { getEC2Instances };
