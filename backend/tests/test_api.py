"""
Backend API Tests for Avantra Chemicals Website
Tests: Products, Contact, Dealers, Admin Authentication, Stats
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
ADMIN_PASSWORD = "avantra2024"

class TestAPIHealth:
    """API Health and Basic Endpoints"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert data["message"] == "Avantra Chemicals API"
        print("API root endpoint working correctly")

    def test_stats_endpoint(self):
        """Test stats endpoint"""
        response = requests.get(f"{BASE_URL}/api/stats")
        assert response.status_code == 200
        data = response.json()
        assert "products" in data
        assert "dealers" in data
        assert "farmers_served" in data
        assert "acres_covered" in data
        assert data["products"] >= 0
        print(f"Stats: {data['products']} products, {data['dealers']} dealers")


class TestProducts:
    """Product CRUD and listing tests"""
    
    def test_list_all_products(self):
        """Test listing all products"""
        response = requests.get(f"{BASE_URL}/api/products")
        assert response.status_code == 200
        products = response.json()
        assert isinstance(products, list)
        assert len(products) > 0
        print(f"Found {len(products)} products")
    
    def test_list_featured_products(self):
        """Test listing featured products only"""
        response = requests.get(f"{BASE_URL}/api/products", params={"featured": True})
        assert response.status_code == 200
        products = response.json()
        assert isinstance(products, list)
        # All returned products should be featured
        for product in products:
            assert product.get("featured") == True
        print(f"Found {len(products)} featured products")
    
    def test_filter_by_category(self):
        """Test filtering products by category"""
        # Test biostimulant category
        response = requests.get(f"{BASE_URL}/api/products", params={"category": "biostimulant"})
        assert response.status_code == 200
        products = response.json()
        assert isinstance(products, list)
        for product in products:
            assert product["category"] == "biostimulant"
        print(f"Found {len(products)} biostimulant products")
    
    def test_get_product_by_slug(self):
        """Test getting product by slug"""
        # First get all products
        response = requests.get(f"{BASE_URL}/api/products")
        products = response.json()
        assert len(products) > 0
        
        # Get first product's slug
        slug = products[0]["slug"]
        
        # Get product by slug
        response = requests.get(f"{BASE_URL}/api/products/{slug}")
        assert response.status_code == 200
        product = response.json()
        assert product["slug"] == slug
        assert "name" in product
        assert "category" in product
        print(f"Successfully retrieved product: {product['name']}")
    
    def test_product_not_found(self):
        """Test 404 for non-existent product"""
        response = requests.get(f"{BASE_URL}/api/products/non-existent-product-slug-xyz")
        assert response.status_code == 404
        print("Product not found returns 404 correctly")
    
    def test_product_multilingual_content(self):
        """Test that products have multilingual content"""
        response = requests.get(f"{BASE_URL}/api/products?featured=true")
        products = response.json()
        
        # Check first product has multilingual fields
        if len(products) > 0:
            product = products[0]
            # Check tagline has multiple languages
            if "tagline" in product and isinstance(product["tagline"], dict):
                languages = product["tagline"].keys()
                # Should have at least English
                assert "en" in languages, "English tagline missing"
                print(f"Product '{product['name']}' has taglines in languages: {list(languages)}")


class TestAdminAuth:
    """Admin authentication tests"""
    
    def test_admin_login_success(self):
        """Test successful admin login"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert isinstance(data["token"], str)
        assert len(data["token"]) > 0
        print("Admin login successful, token received")
    
    def test_admin_login_invalid_password(self):
        """Test login with wrong password"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": "wrongpassword"})
        assert response.status_code == 401
        print("Invalid password correctly rejected with 401")
    
    def test_admin_protected_route_without_token(self):
        """Test accessing protected route without token"""
        response = requests.get(f"{BASE_URL}/api/contact")
        assert response.status_code == 401
        print("Protected route correctly returns 401 without token")
    
    def test_admin_protected_route_with_token(self):
        """Test accessing protected route with valid token"""
        # Login first
        login_response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
        token = login_response.json()["token"]
        
        # Access protected route
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/contact", headers=headers)
        assert response.status_code == 200
        print("Protected route accessible with valid token")


class TestContact:
    """Contact form submission tests"""
    
    def test_submit_contact_form(self):
        """Test submitting contact form"""
        test_id = str(uuid.uuid4())[:8]
        contact_data = {
            "name": f"TEST_User_{test_id}",
            "email": f"test_{test_id}@example.com",
            "phone": "9876543210",
            "message": "This is a test message from automated testing",
            "language": "en"
        }
        
        response = requests.post(f"{BASE_URL}/api/contact", json=contact_data)
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data["name"] == contact_data["name"]
        assert data["email"] == contact_data["email"]
        assert "created_at" in data
        print(f"Contact form submitted successfully, ID: {data['id']}")
    
    def test_contact_form_required_fields(self):
        """Test contact form with missing required fields"""
        # Missing name and message
        contact_data = {
            "email": "test@example.com"
        }
        
        response = requests.post(f"{BASE_URL}/api/contact", json=contact_data)
        # Should return validation error
        assert response.status_code in [400, 422]
        print("Contact form validation working - missing fields rejected")
    
    def test_admin_view_contacts(self):
        """Test admin can view contact submissions"""
        # Login first
        login_response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
        token = login_response.json()["token"]
        
        # Get contacts
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/contact", headers=headers)
        assert response.status_code == 200
        contacts = response.json()
        assert isinstance(contacts, list)
        print(f"Admin retrieved {len(contacts)} contact submissions")


class TestDealers:
    """Dealer application tests"""
    
    def test_submit_dealer_application(self):
        """Test submitting dealer application"""
        test_id = str(uuid.uuid4())[:8]
        dealer_data = {
            "name": f"TEST_Dealer_{test_id}",
            "business_name": f"Test Business {test_id}",
            "email": f"dealer_{test_id}@example.com",
            "phone": "9876543210",
            "location": "Bengaluru, Karnataka",
            "message": "Interested in becoming a dealer"
        }
        
        response = requests.post(f"{BASE_URL}/api/dealers/apply", json=dealer_data)
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data["name"] == dealer_data["name"]
        assert data["email"] == dealer_data["email"]
        assert data["location"] == dealer_data["location"]
        print(f"Dealer application submitted successfully, ID: {data['id']}")
    
    def test_dealer_application_required_fields(self):
        """Test dealer application with missing required fields"""
        dealer_data = {
            "name": "Test Dealer"
            # Missing email, phone, location
        }
        
        response = requests.post(f"{BASE_URL}/api/dealers/apply", json=dealer_data)
        # Should return validation error
        assert response.status_code in [400, 422]
        print("Dealer form validation working - missing fields rejected")
    
    def test_admin_view_dealer_applications(self):
        """Test admin can view dealer applications"""
        # Login first
        login_response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
        token = login_response.json()["token"]
        
        # Get dealer applications
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/dealers/applications", headers=headers)
        assert response.status_code == 200
        applications = response.json()
        assert isinstance(applications, list)
        print(f"Admin retrieved {len(applications)} dealer applications")


class TestAdminCRUD:
    """Admin CRUD operations for products"""
    
    def get_admin_token(self):
        """Helper to get admin token"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
        return response.json()["token"]
    
    def test_create_product(self):
        """Test creating a new product"""
        token = self.get_admin_token()
        headers = {"Authorization": f"Bearer {token}"}
        
        test_id = str(uuid.uuid4())[:8]
        product_data = {
            "name": f"TEST_Product_{test_id}",
            "slug": f"test-product-{test_id}",
            "category": "biostimulant",
            "image_url": "",
            "tagline": {"en": "Test product tagline", "te": "టెస్ట్ ప్రోడక్ట్"},
            "overview": {"en": "Test product overview"},
            "featured": False
        }
        
        response = requests.post(f"{BASE_URL}/api/products", json=product_data, headers=headers)
        assert response.status_code == 200
        product = response.json()
        assert product["name"] == product_data["name"]
        assert product["slug"] == product_data["slug"]
        assert "id" in product
        print(f"Created test product: {product['name']}, ID: {product['id']}")
        return product["id"]
    
    def test_update_product(self):
        """Test updating a product"""
        token = self.get_admin_token()
        headers = {"Authorization": f"Bearer {token}"}
        
        # First create a product
        test_id = str(uuid.uuid4())[:8]
        product_data = {
            "name": f"TEST_Update_{test_id}",
            "slug": f"test-update-{test_id}",
            "category": "biostimulant",
            "featured": False
        }
        
        create_response = requests.post(f"{BASE_URL}/api/products", json=product_data, headers=headers)
        product_id = create_response.json()["id"]
        
        # Update the product
        updated_data = {
            "name": f"TEST_Updated_{test_id}",
            "slug": f"test-updated-{test_id}",
            "category": "biofertilizer",
            "featured": True
        }
        
        response = requests.put(f"{BASE_URL}/api/products/{product_id}", json=updated_data, headers=headers)
        assert response.status_code == 200
        updated = response.json()
        assert updated["name"] == updated_data["name"]
        assert updated["category"] == "biofertilizer"
        assert updated["featured"] == True
        print(f"Updated product successfully: {updated['name']}")
    
    def test_delete_product(self):
        """Test deleting a product"""
        token = self.get_admin_token()
        headers = {"Authorization": f"Bearer {token}"}
        
        # First create a product
        test_id = str(uuid.uuid4())[:8]
        product_data = {
            "name": f"TEST_Delete_{test_id}",
            "slug": f"test-delete-{test_id}",
            "category": "biostimulant"
        }
        
        create_response = requests.post(f"{BASE_URL}/api/products", json=product_data, headers=headers)
        product_id = create_response.json()["id"]
        
        # Delete the product
        response = requests.delete(f"{BASE_URL}/api/products/{product_id}", headers=headers)
        assert response.status_code == 200
        
        # Verify deletion - product should not exist by slug
        get_response = requests.get(f"{BASE_URL}/api/products/{product_data['slug']}")
        assert get_response.status_code == 404
        print(f"Deleted product successfully, ID: {product_id}")
    
    def test_create_product_without_auth(self):
        """Test creating product without authentication fails"""
        product_data = {
            "name": "Unauthorized Product",
            "slug": "unauthorized-product",
            "category": "biostimulant"
        }
        
        response = requests.post(f"{BASE_URL}/api/products", json=product_data)
        assert response.status_code == 401
        print("Create product without auth correctly returns 401")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
