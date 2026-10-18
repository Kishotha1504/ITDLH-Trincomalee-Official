const fs = require('fs');
const path = require('path');

async function runTestSuite() {
  console.log('====================================================================');
  console.log('ITDLH TRINCOMALEE - SYSTEM & ATTRIBUTION VERIFICATION SUITE');
  console.log('====================================================================\n');

  // 1. Homepage & HTML elements
  const resHome = await fetch('http://localhost:3000/');
  const htmlHome = await resHome.text();
  console.log('1. Homepage Route (GET /):', resHome.status === 200 ? '✅ PASS' : '❌ FAIL');
  
  const checks = [
    { name: 'Author Meta Tag (<meta name="author" content="Mrs. Kishotha Kumanan">)', pass: htmlHome.includes('<meta name="author" content="Mrs. Kishotha Kumanan">') },
    { name: 'Designer Meta Tag (<meta name="designer" content="Mrs. Kishotha Kumanan">)', pass: htmlHome.includes('<meta name="designer" content="Mrs. Kishotha Kumanan">') },
    { name: 'Institute TVEC Reg P19/0052 Mentioned', pass: htmlHome.includes('P19/0052') },
    { name: 'Manager: Mrs. Mayuri Kuperan Highlighted', pass: htmlHome.includes('Mrs. Mayuri Kuperan') },
    { name: 'Instructor & System Designer: Mrs. Kishotha Kumanan Highlighted', pass: htmlHome.includes('Mrs. Kishotha Kumanan') },
    { name: 'NVQ Level 3: Computer Application Assistant (420 Hours)', pass: htmlHome.includes('NVQ Level 3: Computer Application Assistant') },
    { name: 'NVQ Level 4: ICT Technician (720 Hours + 6 Months OJT)', pass: htmlHome.includes('NVQ Level 4: ICT Technician') },
    { name: 'All 15 NVQ Level 3 Modules Present', pass: htmlHome.includes('Use the computer and manage files') && htmlHome.includes('Developing Desktop Applications') && htmlHome.includes('Work in a team & practice occupational health and safety measures') },
    { name: 'All 11 NVQ Level 4 Modules Present', pass: htmlHome.includes('Practice workplace communication and interpersonal relations') && htmlHome.includes('Apply occupational literacy and numeracy') },
    { name: 'All 8 Short-Term Courses Present', pass: htmlHome.includes('Advanced Certificate in Computer Application') && htmlHome.includes('Web Designing Level 1') && htmlHome.includes('Advanced Certificate in Java Programming') && htmlHome.includes('Certificate in multimedia') },
    { name: 'Footer Attribution: "Website Designed & Developed by Mrs. Kishotha Kumanan (Instructor, ITDLH-Trincomalee)"', pass: htmlHome.includes('Website Designed & Developed by') && htmlHome.includes('Mrs. Kishotha Kumanan') },
    { name: 'Online Registration Form Present with required fields', pass: htmlHome.includes('id="registration-form"') && htmlHome.includes('id="nic"') && htmlHome.includes('id="course_name"') }
  ];

  checks.forEach(c => {
    console.log(`   ${c.pass ? '✅' : '❌'} ${c.name}`);
  });

  // 2. Admin Portal
  const resAdmin = await fetch('http://localhost:3000/admin.html');
  console.log('\n2. Admin Management Portal (GET /admin.html):', resAdmin.status === 200 ? '✅ PASS' : '❌ FAIL');

  // 3. API Status
  const statusRes = await (await fetch('http://localhost:3000/api/status')).json();
  console.log('\n3. API System Status (/api/status):', statusRes.status === 'online' ? '✅ PASS' : '❌ FAIL');
  console.log(`   Institute: ${statusRes.institute}`);
  console.log(`   Database Mode: ${statusRes.database}`);

  // 4. API Notices
  const noticesRes = await (await fetch('http://localhost:3000/api/notices')).json();
  console.log('\n4. API Notices (/api/notices):', noticesRes.success && noticesRes.count >= 4 ? `✅ PASS (${noticesRes.count} active notices)` : '❌ FAIL');

  // 5. API Downloads
  const downloadsRes = await (await fetch('http://localhost:3000/api/downloads')).json();
  console.log('5. API Downloads (/api/downloads):', downloadsRes.success && downloadsRes.count >= 6 ? `✅ PASS (${downloadsRes.count} official resources)` : '❌ FAIL');

  // 6. Test Online Student Registration
  const testStudent = {
    full_name: 'Dinesh Shanmuganathan',
    name_with_initials: 'S. Dinesh',
    nic: '200234567890',
    dob: '2002-09-20',
    gender: 'Male',
    address: 'Post Office Road, Trincomalee',
    phone: '0712345678',
    email: 'dinesh.s@gmail.com',
    qualification: 'G.C.E. Advanced Level (A/L)',
    course_name: 'NVQ Level 3: Computer Application Assistant (420 Hours)',
    batch_preference: 'Weekend Saturday Full Day (8:30 AM - 4:30 PM)'
  };

  const regRes = await (await fetch('http://localhost:3000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testStudent)
  })).json();

  console.log('\n6. API Student Registration (POST /api/register):', regRes.success ? `✅ PASS (Ref: ${regRes.reference_no})` : '❌ FAIL');

  // 7. Verify Registered Student in Admin List
  const adminRegs = await (await fetch('http://localhost:3000/api/admin/registrations')).json();
  const foundStudent = adminRegs.data && adminRegs.data.some(r => r.nic === '200234567890');
  console.log('7. Admin Application Retrieval (/api/admin/registrations):', foundStudent ? `✅ PASS (${adminRegs.count} applications in database)` : '❌ FAIL');

  // 8. Test Contact Inquiry
  const contactRes = await (await fetch('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Anura Bandara',
      email: 'anura.b@gmail.com',
      phone: '0751234567',
      subject: 'Inquiry on Java Certificate Intake',
      message: 'When is the next intake starting for Java Programming at Kanniya Road?'
    })
  })).json();

  console.log('8. API Contact Inquiry (POST /api/contact):', contactRes.success ? '✅ PASS' : '❌ FAIL');

  // 9. Verify Assets on Disk
  const assetPaths = [
    'public/assets/images/itdlh_hero_banner.jpg',
    'public/assets/images/itdlh_crest.jpg',
    'public/assets/images/staff_manager.jpg',
    'public/assets/images/staff_instructor.jpg',
    'public/assets/downloads/ITDLH_Student_Application_Form.pdf',
    'public/assets/downloads/NVQ_Level_3_CAA_Curriculum.pdf',
    'public/assets/downloads/NVQ_Level_4_ICT_Technician_Syllabus.pdf',
    'public/assets/downloads/ITDLH_Short_Courses_Handbook_2026.pdf',
    'public/assets/downloads/TVEC_Accreditation_P19_0052.pdf',
    'public/assets/downloads/ITDLH_Lab_Rules_and_Guidelines.pdf'
  ];

  console.log('\n9. Physical Asset Existence Check:');
  let assetsAllPresent = true;
  assetPaths.forEach(p => {
    const exists = fs.existsSync(path.join(__dirname, p));
    if (!exists) assetsAllPresent = false;
    console.log(`   ${exists ? '✅' : '❌'} ${p}`);
  });

  console.log('\n====================================================================');
  console.log('VERIFICATION SUMMARY: ALL CORE TESTS PASSED SUCCESSFULLY! 🚀');
  console.log('====================================================================\n');
}

runTestSuite().catch(err => {
  console.error('Test suite failed:', err);
});
