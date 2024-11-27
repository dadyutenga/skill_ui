import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/profile.css';
import profileService from '../services/profileService';
import Select from 'react-select';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    picture: '',
    bio: '',
    phone: '',
    location: '',
    age: '',
    specialization: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const specializations = [
    // Technology
    { value: 'frontend', label: 'Frontend Development', category: 'Tech' },
    { value: 'backend', label: 'Backend Development', category: 'Tech' },
    { value: 'fullstack', label: 'Full Stack Development', category: 'Tech' },
    { value: 'mobile', label: 'Mobile Development', category: 'Tech' },
    { value: 'devops', label: 'DevOps', category: 'Tech' },
    { value: 'ai_ml', label: 'AI/Machine Learning', category: 'Tech' },
    { value: 'cybersecurity', label: 'Cybersecurity', category: 'Tech' },
    
    // Business
    { value: 'project_management', label: 'Project Management', category: 'Business' },
    { value: 'business_analysis', label: 'Business Analysis', category: 'Business' },
    { value: 'digital_marketing', label: 'Digital Marketing', category: 'Business' },
    { value: 'product_management', label: 'Product Management', category: 'Business' },
    { value: 'business_strategy', label: 'Business Strategy', category: 'Business' },
    
    // Finance
    { value: 'accounting', label: 'Accounting', category: 'Finance' },
    { value: 'investment', label: 'Investment Analysis', category: 'Finance' },
    { value: 'financial_planning', label: 'Financial Planning', category: 'Finance' },
    { value: 'risk_management', label: 'Risk Management', category: 'Finance' },
    { value: 'blockchain_finance', label: 'Blockchain & Crypto', category: 'Finance' },
    
    // Entrepreneurship
    { value: 'startup_founder', label: 'Startup Founder', category: 'Entrepreneurship' },
    { value: 'business_development', label: 'Business Development', category: 'Entrepreneurship' },
    { value: 'innovation', label: 'Innovation & Strategy', category: 'Entrepreneurship' },
    { value: 'social_entrepreneurship', label: 'Social Entrepreneurship', category: 'Entrepreneurship' },
    { value: 'ecommerce', label: 'E-commerce', category: 'Entrepreneurship' }
  ];

  const countries = [
    // East Africa
    { value: 'TZ', label: 'Tanzania', code: '+255' },
    { value: 'KE', label: 'Kenya', code: '+254' },
    { value: 'UG', label: 'Uganda', code: '+256' },
    { value: 'RW', label: 'Rwanda', code: '+250' },
    
    // West Africa
    { value: 'NG', label: 'Nigeria', code: '+234' },
    { value: 'GH', label: 'Ghana', code: '+233' },
    { value: 'SN', label: 'Senegal', code: '+221' },
    
    // Southern Africa
    { value: 'ZA', label: 'South Africa', code: '+27' },
    { value: 'BW', label: 'Botswana', code: '+267' },
    { value: 'ZM', label: 'Zambia', code: '+260' },
    
    // Other major countries
    { value: 'US', label: 'United States', code: '+1' },
    { value: 'GB', label: 'United Kingdom', code: '+44' },
    { value: 'IN', label: 'India', code: '+91' },
  ];

  // Group specializations by category for the Select component
  const groupedSpecializations = [
    {
      label: 'Technology',
      options: specializations.filter(spec => spec.category === 'Tech')
    },
    {
      label: 'Business',
      options: specializations.filter(spec => spec.category === 'Business')
    },
    {
      label: 'Finance',
      options: specializations.filter(spec => spec.category === 'Finance')
    },
    {
      label: 'Entrepreneurship',
      options: specializations.filter(spec => spec.category === 'Entrepreneurship')
    }
  ];

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await profileService.getProfile();
      setProfile(userData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          picture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadProfile();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await profileService.updateProfile(profile);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBack = () => {
    navigate('/welcome');
  };

  const handleSpecializationChange = (selectedOptions) => {
    setProfile(prev => ({
      ...prev,
      specialization: selectedOptions.map(option => option.value).join(', ')
    }));
  };

  const handleCountryChange = (selectedOption) => {
    if (selectedOption) {
      setProfile(prev => ({
        ...prev,
        location: selectedOption.label,
        // Preserve existing phone number digits but update country code
        phone: selectedOption.code + (prev.phone?.replace(/^\+\d+/, '') || '')
      }));
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button 
          type="button" 
          className="back-button"
          onClick={handleBack}
        >
          ← Back
        </button>
        <h1>Profile Settings</h1>
      </div>

      <div className="profile-content">
        <div className="profile-image-section">
          <div className="profile-image">
            <img src={profile.picture || 'default-avatar.png'} alt={profile.name} />
            {isEditing && (
              <label className="image-upload">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                />
                <span>Change Photo</span>
              </label>
            )}
          </div>
        </div>

        <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={isEditing ? 'editable' : ''}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={isEditing ? 'editable' : ''}
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={profile.phone || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={isEditing ? 'editable' : ''}
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <Select
              options={countries}
              value={countries.find(country => country.label === profile.location)}
              onChange={handleCountryChange}
              isDisabled={!isEditing}
              className={isEditing ? 'select-editable' : ''}
              placeholder="Search and select your country..."
              isClearable
              isSearchable
              classNamePrefix="select"
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={profile.bio || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={isEditing ? 'editable' : ''}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={profile.age || ''}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={isEditing ? 'editable' : ''}
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Specialization</label>
            <Select
              isMulti
              options={groupedSpecializations}
              value={profile.specialization?.split(', ').map(spec => 
                specializations.find(s => s.value === spec)
              ).filter(Boolean)}
              onChange={handleSpecializationChange}
              isDisabled={!isEditing}
              className={isEditing ? 'select-editable' : ''}
              placeholder="Search and select specializations..."
              isSearchable
              classNamePrefix="select"
            />
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <button 
                type="button" 
                className="edit-button"
                onClick={handleEdit}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button 
                  type="button" 
                  className="save-button"
                  onClick={handleSubmit}
                >
                  Save Changes
                </button>
                <button 
                  type="button"
                  className="cancel-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
