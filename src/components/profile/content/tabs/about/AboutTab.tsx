
import React, { useState } from 'react';
import AboutSidebar from './AboutSidebar';
import AboutOverview from './AboutOverview';
import AboutWorkEducation from './AboutWorkEducation';
import AboutPlacesLived from './AboutPlacesLived';
import AboutContactInfo from './AboutContactInfo';
import AboutFamilyRelationships from './AboutFamilyRelationships';
import AboutDetails from './AboutDetails';
import AboutLifeEvents from './AboutLifeEvents';
import { useProfileSettings } from '@/hooks/useProfileSettings';

interface AboutTabProps {
  userProfile: any;
}

const AboutTab: React.FC<AboutTabProps> = ({ userProfile }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const { userInfo } = useProfileSettings();
  
  // Build details from live profile settings data
  const details = {
    workplace: userInfo.company || 'Add workplace',
    position: userInfo.profession || 'Add job title',
    education: userInfo.school || 'Add education',
    startYear: '2006', // This could be enhanced with a separate field later
    location: userInfo.location || 'Add location',
    hometown: userInfo.city_location || 'Add hometown',
    relationship: userInfo.relationship_status || 'Add relationship status',
    relationshipDate: 'Add date', // This could be enhanced later
    phone: userInfo.phone_number || 'Add phone',
    email: userInfo.email || 'Add email',
    website: userInfo.website || 'Add website'
  };

  return (
    <div className="w-full mt-4">
      <div className="flex w-full bg-white rounded-lg shadow">
        <AboutSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        
        <div className="flex-1 p-4">
          {activeSection === 'overview' && <AboutOverview details={details} />}
          {activeSection === 'work' && <AboutWorkEducation details={details} />}
          {activeSection === 'places' && <AboutPlacesLived details={details} />}
          {activeSection === 'contact' && <AboutContactInfo details={details} />}
          {activeSection === 'family' && <AboutFamilyRelationships details={details} />}
          {activeSection === 'details' && <AboutDetails />}
          {activeSection === 'events' && <AboutLifeEvents />}
        </div>
      </div>
    </div>
  );
};

export default AboutTab;
