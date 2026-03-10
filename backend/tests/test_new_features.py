"""
Backend API Tests for Avantra Chemicals - NEW Features (Iteration 2)
Tests: Settings, Jobs CRUD, Job Applications, New Pages (Careers, Terms, Privacy, Corporate)
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
ADMIN_PASSWORD = "avantra2024"

def get_admin_token():
    """Helper to get admin token"""
    response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
    assert response.status_code == 200, "Admin login failed"
    return response.json()["token"]


class TestSiteSettings:
    """Site Settings API tests - Hero image, logo, about image, phytocode image, social links"""
    
    def test_get_default_settings(self):
        """Test getting default site settings (no auth required)"""
        response = requests.get(f"{BASE_URL}/api/settings")
        assert response.status_code == 200
        settings = response.json()
        
        # Should have default fields
        assert "hero_image" in settings
        assert "logo_url" in settings
        assert "about_image" in settings
        assert "phytocode_image" in settings
        assert "social_links" in settings
        
        # Social links should have all platforms
        social = settings.get("social_links", {})
        assert "youtube" in social or social == {}
        print(f"Settings retrieved: hero_image set={bool(settings.get('hero_image'))}")
    
    def test_update_settings_without_auth(self):
        """Test updating settings without auth should fail"""
        response = requests.put(f"{BASE_URL}/api/settings", json={
            "hero_image": "https://example.com/image.jpg"
        })
        assert response.status_code == 401
        print("Update settings without auth correctly returns 401")
    
    def test_update_hero_image(self):
        """Test updating hero image"""
        token = get_admin_token()
        headers = {"Authorization": f"Bearer {token}"}
        
        test_image = "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920"
        response = requests.put(f"{BASE_URL}/api/settings", json={
            "hero_image": test_image
        }, headers=headers)
        
        assert response.status_code == 200
        settings = response.json()
        assert settings["hero_image"] == test_image
        print("Hero image updated successfully")
    
    def test_update_social_links(self):
        """Test updating social media links"""
        token = get_admin_token()
        headers = {"Authorization": f"Bearer {token}"}
        
        social_links = {
            "youtube": "https://youtube.com/@avantra",
            "twitter": "https://twitter.com/avantra",
            "instagram": "https://instagram.com/avantra",
            "facebook": "https://facebook.com/avantra",
            "linkedin": "https://linkedin.com/company/avantra"
        }
        
        response = requests.put(f"{BASE_URL}/api/settings", json={
            "social_links": social_links
        }, headers=headers)
        
        assert response.status_code == 200
        settings = response.json()
        assert settings["social_links"]["youtube"] == social_links["youtube"]
        assert settings["social_links"]["linkedin"] == social_links["linkedin"]
        print("Social links updated successfully")
    
    def test_update_all_images(self):
        """Test updating all image URLs"""
        token = get_admin_token()
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.put(f"{BASE_URL}/api/settings", json={
            "logo_url": "https://example.com/logo.png",
            "about_image": "https://example.com/about.jpg",
            "phytocode_image": "https://example.com/phytocode.jpg"
        }, headers=headers)
        
        assert response.status_code == 200
        settings = response.json()
        assert settings["logo_url"] == "https://example.com/logo.png"
        assert settings["about_image"] == "https://example.com/about.jpg"
        assert settings["phytocode_image"] == "https://example.com/phytocode.jpg"
        print("All image URLs updated successfully")


class TestJobsCRUD:
    """Jobs CRUD API tests"""
    
    def test_list_jobs_public(self):
        """Test listing active jobs (public endpoint)"""
        response = requests.get(f"{BASE_URL}/api/jobs")
        assert response.status_code == 200
        jobs = response.json()
        assert isinstance(jobs, list)
        # All jobs should be active by default
        for job in jobs:
            assert job.get("is_active") == True
        print(f"Public jobs list: {len(jobs)} active jobs")
    
    def test_list_all_jobs_admin(self):
        """Test listing all jobs including inactive (admin)"""
        token = get_admin_token()
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.get(f"{BASE_URL}/api/jobs?active_only=false", headers=headers)
        assert response.status_code == 200
        jobs = response.json()
        assert isinstance(jobs, list)
        print(f"Admin jobs list: {len(jobs)} total jobs")
    
    def test_create_job(self):
        """Test creating a new job posting"""
        token = get_admin_token()
        headers = {"Authorization": f"Bearer {token}"}
        
        test_id = str(uuid.uuid4())[:8]
        job_data = {
            "title": f"TEST_Software Engineer_{test_id}",
            "department": "Engineering",
            "location": "Bengaluru",
            "type": "Full-time",
            "experience": "2-5 years",
            "description": "We are looking for a passionate software engineer to join our team.",
            "requirements": ["Bachelor's degree in CS", "3+ years experience", "Python/JS proficiency"],
            "responsibilities": ["Build APIs", "Write tests", "Code reviews"],
            "salary_range": "10-15 LPA",
            "is_active": True
        }
        
        response = requests.post(f"{BASE_URL}/api/jobs", json=job_data, headers=headers)
        assert response.status_code == 200
        job = response.json()
        
        assert job["title"] == job_data["title"]
        assert job["department"] == job_data["department"]
        assert job["location"] == job_data["location"]
        assert "id" in job
        assert "created_at" in job
        print(f"Created job: {job['title']}, ID: {job['id']}")
        return job["id"]
    
    def test_create_job_without_auth(self):
        """Test creating job without auth should fail"""
        response = requests.post(f"{BASE_URL}/api/jobs", json={
            "title": "Unauthorized Job",
            "department": "Test"
        })
        assert response.status_code == 401
        print("Create job without auth correctly returns 401")
    
    def test_get_job_by_id(self):
        """Test getting job by ID"""
        # First create a job
        token = get_admin_token()
        headers = {"Authorization": f"Bearer {token}"}
        
        test_id = str(uuid.uuid4())[:8]
        job_data = {
            "title": f"TEST_Get_Job_{test_id}",
            "department": "HR",
            "location": "Remote",
            "is_active": True
        }
        
        create_response = requests.post(f"{BASE_URL}/api/jobs", json=job_data, headers=headers)
        job_id = create_response.json()["id"]
        
        # Get job by ID (public)
        response = requests.get(f"{BASE_URL}/api/jobs/{job_id}")
        assert response.status_code == 200
        job = response.json()
        assert job["id"] == job_id
        assert job["title"] == job_data["title"]
        print(f"Retrieved job: {job['title']}")
    
    def test_get_job_not_found(self):
        """Test 404 for non-existent job"""
        response = requests.get(f"{BASE_URL}/api/jobs/non-existent-job-id-xyz")
        assert response.status_code == 404
        print("Job not found returns 404 correctly")
    
    def test_update_job(self):
        """Test updating a job"""
        token = get_admin_token()
        headers = {"Authorization": f"Bearer {token}"}
        
        # Create a job first
        test_id = str(uuid.uuid4())[:8]
        job_data = {
            "title": f"TEST_Update_Job_{test_id}",
            "department": "Sales",
            "is_active": True
        }
        
        create_response = requests.post(f"{BASE_URL}/api/jobs", json=job_data, headers=headers)
        job_id = create_response.json()["id"]
        
        # Update job
        updated_data = {
            "title": f"TEST_Updated_Job_{test_id}",
            "department": "Marketing",
            "location": "Mumbai",
            "is_active": False
        }
        
        response = requests.put(f"{BASE_URL}/api/jobs/{job_id}", json=updated_data, headers=headers)
        assert response.status_code == 200
        job = response.json()
        assert job["title"] == updated_data["title"]
        assert job["department"] == "Marketing"
        assert job["is_active"] == False
        print(f"Updated job: {job['title']}")
    
    def test_delete_job(self):
        """Test deleting a job"""
        token = get_admin_token()
        headers = {"Authorization": f"Bearer {token}"}
        
        # Create a job first
        test_id = str(uuid.uuid4())[:8]
        job_data = {
            "title": f"TEST_Delete_Job_{test_id}",
            "department": "Test",
            "is_active": True
        }
        
        create_response = requests.post(f"{BASE_URL}/api/jobs", json=job_data, headers=headers)
        job_id = create_response.json()["id"]
        
        # Delete job
        response = requests.delete(f"{BASE_URL}/api/jobs/{job_id}", headers=headers)
        assert response.status_code == 200
        
        # Verify deletion
        get_response = requests.get(f"{BASE_URL}/api/jobs/{job_id}")
        assert get_response.status_code == 404
        print(f"Deleted job successfully, ID: {job_id}")


class TestJobApplications:
    """Job Applications API tests"""
    
    def create_test_job(self):
        """Helper to create a test job for applications"""
        token = get_admin_token()
        headers = {"Authorization": f"Bearer {token}"}
        
        test_id = str(uuid.uuid4())[:8]
        job_data = {
            "title": f"TEST_Job_For_Application_{test_id}",
            "department": "Engineering",
            "location": "Bengaluru",
            "is_active": True
        }
        
        response = requests.post(f"{BASE_URL}/api/jobs", json=job_data, headers=headers)
        return response.json()["id"], job_data["title"]
    
    def test_submit_job_application(self):
        """Test submitting a job application"""
        job_id, job_title = self.create_test_job()
        
        test_id = str(uuid.uuid4())[:8]
        application_data = {
            "job_id": job_id,
            "name": f"TEST_Applicant_{test_id}",
            "email": f"applicant_{test_id}@example.com",
            "phone": "9876543210",
            "address": "123 Test Street, Bengaluru",
            "current_company": "Test Corp",
            "current_ctc": "8 LPA",
            "photo_base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
            "resume_base64": "data:application/pdf;base64,JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDU1ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDAgMCBUZAogICAgKEhlbGxvIFdvcmxkKSBUagogIEVUCmVuZHN0cmVhbQplbmRvYmoKCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxOCAwMDAwMCBuIAowMDAwMDAwMDc3IDAwMDAwIG4gCjAwMDAwMDAxNzggMDAwMDAgbiAKMDAwMDAwMDQ1NyAwMDAwMCBuIAp0cmFpbGVyCiAgPDwgIC9Sb290IDEgMCBSCiAgICAgIC9TaXplIDUKICA+PgpzdGFydHhyZWYKNTY1CiUlRU9GCg==",
            "payslip_base64": None
        }
        
        response = requests.post(f"{BASE_URL}/api/jobs/apply", json=application_data)
        assert response.status_code == 200
        result = response.json()
        assert "id" in result
        assert result.get("message") == "Application submitted successfully"
        print(f"Application submitted successfully for job: {job_title}")
        return result["id"]
    
    def test_submit_application_with_payslip(self):
        """Test submitting application with all files including payslip"""
        job_id, job_title = self.create_test_job()
        
        test_id = str(uuid.uuid4())[:8]
        application_data = {
            "job_id": job_id,
            "name": f"TEST_Full_Applicant_{test_id}",
            "email": f"full_applicant_{test_id}@example.com",
            "phone": "9876543210",
            "address": "456 Full Test Ave",
            "current_company": "Current Corp",
            "current_ctc": "12 LPA",
            "photo_base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
            "resume_base64": "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgo+PgplbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDE0NyAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDQKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjE5NwolJUVPRgo=",
            "payslip_base64": "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwo+PgplbmRvYmoKeHJlZgowIDIKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgMgovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNTgKJSVFT0YK"
        }
        
        response = requests.post(f"{BASE_URL}/api/jobs/apply", json=application_data)
        assert response.status_code == 200
        result = response.json()
        assert "id" in result
        print(f"Full application with payslip submitted")
    
    def test_admin_list_applications(self):
        """Test admin listing job applications"""
        token = get_admin_token()
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.get(f"{BASE_URL}/api/jobs/applications/list", headers=headers)
        assert response.status_code == 200
        applications = response.json()
        assert isinstance(applications, list)
        
        # Check that base64 files are excluded from list view
        for app in applications:
            assert "photo_base64" not in app, "Photo should be excluded from list"
            assert "resume_base64" not in app, "Resume should be excluded from list"
        print(f"Admin retrieved {len(applications)} job applications")
    
    def test_admin_get_application_detail(self):
        """Test admin getting full application details with files"""
        # First submit an application
        app_id = self.test_submit_job_application()
        
        token = get_admin_token()
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.get(f"{BASE_URL}/api/jobs/applications/{app_id}", headers=headers)
        assert response.status_code == 200
        app = response.json()
        
        assert app["id"] == app_id
        assert "photo_base64" in app
        assert "resume_base64" in app
        assert "job_title" in app
        assert app["status"] == "pending"
        print(f"Application detail retrieved: {app['name']}, Status: {app['status']}")
    
    def test_list_applications_without_auth(self):
        """Test listing applications without auth should fail"""
        response = requests.get(f"{BASE_URL}/api/jobs/applications/list")
        assert response.status_code == 401
        print("List applications without auth correctly returns 401")


class TestStatsWithJobs:
    """Test stats endpoint includes open positions count"""
    
    def test_stats_includes_open_positions(self):
        """Test that stats include open_positions count"""
        response = requests.get(f"{BASE_URL}/api/stats")
        assert response.status_code == 200
        stats = response.json()
        
        assert "open_positions" in stats
        assert isinstance(stats["open_positions"], int)
        assert stats["open_positions"] >= 0
        print(f"Stats: {stats['open_positions']} open positions, {stats['products']} products")


class TestApplicationStatusUpdate:
    """Test application status update endpoint"""
    
    def test_update_application_status(self):
        """Test updating application status"""
        # Create a job and submit application
        token = get_admin_token()
        headers = {"Authorization": f"Bearer {token}"}
        
        # Create job
        test_id = str(uuid.uuid4())[:8]
        job_response = requests.post(f"{BASE_URL}/api/jobs", json={
            "title": f"TEST_Status_Job_{test_id}",
            "is_active": True
        }, headers=headers)
        job_id = job_response.json()["id"]
        
        # Submit application
        app_response = requests.post(f"{BASE_URL}/api/jobs/apply", json={
            "job_id": job_id,
            "name": f"TEST_Status_Applicant_{test_id}",
            "email": f"status_{test_id}@example.com",
            "phone": "9876543210",
            "photo_base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
            "resume_base64": "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwo+PgplbmRvYmoKeHJlZgowIDIKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgMgovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNTgKJSVFT0YK"
        })
        app_id = app_response.json()["id"]
        
        # Update status
        response = requests.put(f"{BASE_URL}/api/jobs/applications/{app_id}/status?status=reviewed", headers=headers)
        assert response.status_code == 200
        
        # Verify status updated
        detail_response = requests.get(f"{BASE_URL}/api/jobs/applications/{app_id}", headers=headers)
        assert detail_response.json()["status"] == "reviewed"
        print(f"Application status updated to 'reviewed'")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
