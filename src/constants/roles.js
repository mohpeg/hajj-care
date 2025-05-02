const ROLES = {
    ADMIN: 'admin',
    MODERATOR: 'moderator', 
    PILGRIM: 'pilgrim',
    DOCTOR: 'doctor',
  };
  
  const ALLOWED_ROLES = {
      PROFILE_MANAGMENT: [ROLES.ADMIN],
      ONBOARDING_MANAGMENT: [ROLES.ADMIN],
  };
  
  module.exports = { ROLES, ALLOWED_ROLES };
  