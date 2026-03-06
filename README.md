# Cloud Posture Scanner

A comprehensive Node.js application for scanning AWS cloud security posture using CIS benchmarks. This tool helps identify security misconfigurations across your AWS infrastructure.

## Features

- **EC2 Security Analysis** - Scan EC2 instances for security group misconfigurations
- **S3 Bucket Security** - Check S3 buckets for encryption and public access issues
- **CIS Benchmark Checks** - Run 5 key CIS AWS Foundations Benchmark security checks
- **Real-time Dashboard** - Modern web interface with color-coded results
- **Persistent Storage** - Store scan results in DynamoDB for historical tracking
- **Multi-region Support** - Configure AWS region for scanning

## CIS Checks Implemented

| Check | Description |
|-------|-------------|
| S3 Public Access | Ensures S3 buckets are not publicly accessible |
| S3 Encryption | Verifies S3 buckets have encryption enabled |
| Root MFA | Checks if root account has MFA enabled | 
| CloudTrail Logging | Confirms CloudTrail is actively logging |
| EC2 SSH Exposure | Detects security groups allowing SSH from 0.0.0.0/0 

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   AWS Services  │
│                 │    │                 │    │                 │
│ HTML/CSS/JS     │◄──►│ Express Server  │◄──►│ EC2, S3, IAM    │
│ Dashboard UI    │    │ API Routes      │    │ CloudTrail,    │
│                 │    │ CIS Checks      │    │ DynamoDB        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📦 Installation

### Prerequisites

- **Node.js** (version 14 or higher)
- **AWS Account** with appropriate IAM permissions


### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cloudPostureScanner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure AWS credentials**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your AWS credentials.
  
4. **Set up DynamoDB table**
   
   Create a DynamoDB table named `CISResults` (or your custom table name) with:
   - **Table name**: `CISResults` (or your `DYNAMODB_TABLE` value)
   - **Primary key**: `id` (String)
   - **Capacity mode**: On-demand or provisioned

## 🔐 Required AWS IAM Permissions

Your AWS credentials need the following permissions:

### Use AWS Managed Policies:
- `AmazonEC2ReadOnlyAccess`
- `AmazonS3ReadOnlyAccess`
- `IAMReadOnlyAccess`
- `AWSCloudTrailReadOnlyAccess`
- `SecurityAudit`
- `AmazonDynamoDBFullAccess`

## Usage

### Starting the Application

1. **Start the server**
   ```bash
   cd server
   node app.js
   ```

2. **Access the dashboard**
   Open your browser and navigate to: `http://localhost:3000`

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/instances` | GET | List all EC2 instances with security details |
| `/buckets` | GET | List all S3 buckets with security status |
| `/cis-results` | GET | Run CIS benchmark checks and store results |

### Frontend Features

The web dashboard provides:
- **EC2 Instances Table** - View instance details and security groups
- **S3 Buckets Table** - Monitor encryption and public access status
- **CIS Security Results** - Color-coded pass/fail indicators with evidence
- **Real-time Updates** - Fresh data on each page load

##  Data Flow

1. **Discovery Phase**
   - Frontend requests data via API calls
   - Backend queries AWS services using SDK v3
   - EC2, S3, IAM, and CloudTrail data collected

2. **Analysis Phase**
   - CIS benchmark checks run against collected data
   - Security violations identified and documented
   - Results compiled with evidence

3. **Storage Phase**
   - Scan results stored in DynamoDB with UUID
   - Timestamp added for historical tracking
   - Results returned to frontend for display

## Configuration

### Customization

- **Custom CIS Checks**: Modify `server/services/cisChecks.js`
- **Additional AWS Services**: Add new service modules in `server/services/`
- **Frontend Styling**: Update `frontend/styles.css`
- **API Endpoints**: Add new routes in `server/routes/`

## 🔧 Development

### Project Structure

```
cloudPostureScanner/
├── frontend/
│   ├── index.html          # Main dashboard
│   ├── styles.css          # Styling
│   └── script.js           # Frontend logic
├── server/
│   ├── app.js              # Express server
│   ├── awsConfig.js        # AWS SDK configuration
│   ├── routes/             # API routes
│   │   ├── instances.js
│   │   ├── buckets.js
│   │   └── cisResults.js
│   └── services/           # Business logic
│       ├── cisChecks.js    # Security checks
│       ├── ec2Service.js   # EC2 operations
│       ├── s3Service.js    # S3 operations
│       └── storageService.js # DynamoDB storage
├── .env.example            # Environment template
├── package.json            # Dependencies
└── README.md               # This file
```

### Adding New CIS Checks

1. Add your check logic to `server/services/cisChecks.js`
2. Follow the existing pattern:
   ```javascript
   results.push({
     check: "Your check description",
     status: condition ? "PASS" : "FAIL",
     evidence: evidenceArray || null
   });
   ```
   
## 🚀 Future Enhancements

- [ ] Additional CIS benchmark checks
- [ ] Multi-region scanning support
- [ ] Scheduled scans with automated reporting
- [ ] Historical scan comparisons and trends
- [ ] Integration with security ticketing systems
- [ ] Role-based access control
- [ ] Export results to multiple formats (PDF, CSV, JSON)

---


