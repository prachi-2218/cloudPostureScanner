async function loadInstances() {
  try {
    const res = await fetch("http://localhost:3000/instances");
    const data = await res.json();
    
    const tbody = document.querySelector("#instances tbody");
    tbody.innerHTML = "";
    
    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="no-data">No EC2 instances found</td></tr>';
      return;
    }
    
    data.forEach(instance => {
      const row = tbody.insertRow();
      row.innerHTML = `
        <td>${instance.instanceId}</td>
        <td>${instance.type}</td>
        <td>${instance.region}</td>
        <td>${instance.publicIp}</td>
        <td>${instance.securityGroups.join(', ')}</td>
      `;
    });
  } catch (error) {
    console.error('Error loading instances:', error);
    document.querySelector("#instances tbody").innerHTML = 
      '<tr><td colspan="5" class="no-data">Error loading instances</td></tr>';
  }
}

async function loadBuckets() {
  try {
    const res = await fetch("http://localhost:3000/buckets");
    const data = await res.json();
    
    const tbody = document.querySelector("#buckets tbody");
    tbody.innerHTML = "";
    
    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="no-data">No S3 buckets found</td></tr>';
      return;
    }
    
    data.forEach(bucket => {
      const row = tbody.insertRow();
      row.innerHTML = `
        <td>${bucket.bucketName}</td>
        <td>${bucket.region}</td>
        <td><span style="color: ${bucket.encrypted ? 'green' : 'red'}">${bucket.encrypted ? '✓ Encrypted' : '✗ Not Encrypted'}</span></td>
        <td><span style="color: ${bucket.public ? 'red' : 'green'}">${bucket.public ? '🔓 Public' : '🔒 Private'}</span></td>
      `;
    });
  } catch (error) {
    console.error('Error loading buckets:', error);
    document.querySelector("#buckets tbody").innerHTML = 
      '<tr><td colspan="4" class="no-data">Error loading buckets</td></tr>';
  }
}

async function loadCIS() {
  try {
    const res = await fetch("http://localhost:3000/cis-results");
    const data = await res.json();
    
    const cisDiv = document.getElementById("cis");
    cisDiv.innerHTML = "";
    
    if (!data.results || data.results.length === 0) {
      cisDiv.innerHTML = '<div class="no-data">No CIS results available</div>';
      return;
    }
    
    data.results.forEach(check => {
      const checkDiv = document.createElement('div');
      checkDiv.className = `check-item ${check.status.toLowerCase()}`;
      
      const statusIcon = check.status === 'PASS' ? '✅' : '❌';
      const statusColor = check.status === 'PASS' ? '#28a745' : '#dc3545';
      
      checkDiv.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <span style="font-size: 1.2em; margin-right: 10px;">${statusIcon}</span>
            <strong>${check.check}</strong>
          </div>
          <span class="status" style="color: ${statusColor}">${check.status}</span>
        </div>
        ${check.evidence && check.evidence.length > 0 ? 
          `<div class="evidence">
            <strong>Evidence:</strong> ${JSON.stringify(check.evidence, null, 2)}
          </div>` : ''
        }
      `;
      
      cisDiv.appendChild(checkDiv);
    });
  } catch (error) {
    console.error('Error loading CIS results:', error);
    document.getElementById("cis").innerHTML = 
      '<div class="no-data">Error loading CIS results</div>';
  }
}

// Load all data when page loads
document.addEventListener('DOMContentLoaded', function() {
  loadInstances();
  loadBuckets();
  loadCIS();
});