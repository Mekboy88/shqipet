import { MenuItem } from './types';
import { Package, Shield } from 'lucide-react';
import { Star } from 'lucide-react';

export const advancedMenuItems: MenuItem[] = [
  {
    id: 'education-learning',
    label: '🎓 Education & Learning',
    icon: Package,
    colorVariant: 'blackGold',
    submenu: [
      { id: 'course-management', label: '📚 Course Management', href: '/admin/education/courses' },
      { id: 'skill-assessments', label: '🎯 Skill Assessments', href: '/admin/education/assessments' },
      { id: 'certifications', label: '🏆 Certifications', href: '/admin/education/certifications' },
      { id: 'instructor-tools', label: '👨‍🏫 Instructor Tools', href: '/admin/education/instructors' },
      { id: 'assignments', label: '📝 Assignments', href: '/admin/education/assignments' },
      { id: 'progress-tracking', label: '📊 Progress Tracking', href: '/admin/education/progress' },
      { id: 'gamification', label: '🎮 Gamification', href: '/admin/education/gamification' },
      { id: 'live-classes', label: '📹 Live Classes', href: '/admin/education/live' },
      { id: 'digital-library', label: '📖 Digital Library', href: '/admin/education/library' },
      { id: 'virtual-labs', label: '🧪 Virtual Labs', href: '/admin/education/labs' }
    ]
  },
  {
    id: 'location-services',
    label: '🌍 Location Services',
    icon: Shield,
    colorVariant: 'brownCream',
    submenu: [
      { id: 'map-integration', label: '🗺️ Map Integration', href: '/admin/location/maps' },
      { id: 'checkin-system', label: '📍 Check-in System', href: '/admin/location/checkin' },
      { id: 'transportation', label: '🚗 Transportation', href: '/admin/location/transport' },
      { id: 'local-business-finder', label: '🏨 Local Business Finder', href: '/admin/location/business' },
      { id: 'geofencing', label: '🎯 Geofencing', href: '/admin/location/geofencing' },
      { id: 'location-analytics', label: '📊 Location Analytics', href: '/admin/location/analytics' },
      { id: 'privacy-controls', label: '🔒 Privacy Controls', href: '/admin/location/privacy' },
      { id: 'route-planning', label: '🛣️ Route Planning', href: '/admin/location/routes' },
      { id: 'traffic-updates', label: '🚦 Traffic Updates', href: '/admin/location/traffic' },
      { id: 'nearby-services', label: '🏪 Nearby Services', href: '/admin/location/services' }
    ]
  },
  {
    id: 'creative-studio',
    label: '🎨 Creative Studio',
    icon: Star,
    colorVariant: 'midnightSilver',
    submenu: [
      { id: 'photo-editor', label: '🖼️ Photo Editor', href: '/admin/creative/photo' },
      { id: 'video-editor', label: '🎬 Video Editor', href: '/admin/creative/video' },
      { id: 'music-studio', label: '🎵 Music Studio', href: '/admin/creative/music' },
      { id: 'graphic-design', label: '🎨 Graphic Design', href: '/admin/creative/graphics' },
      { id: 'writing-tools', label: '📝 Writing Tools', href: '/admin/creative/writing' },
      { id: 'animation-creator', label: '🎭 Animation Creator', href: '/admin/creative/animation' },
      { id: 'digital-art', label: '🖌️ Digital Art', href: '/admin/creative/art' },
      { id: 'photo-filters', label: '📷 Photo Filters', href: '/admin/creative/filters' },
      { id: 'meme-generator', label: '🎪 Meme Generator', href: '/admin/creative/memes' },
      { id: 'story-creator', label: '🎬 Story Creator', href: '/admin/creative/stories' }
    ]
  },
  {
    id: 'health-wellness',
    label: '🏥 Health & Wellness',
    icon: Package,
    colorVariant: 'greenTan',
    submenu: [
      { id: 'fitness-tracking', label: '🏃‍♂️ Fitness Tracking', href: '/admin/health/fitness' },
      { id: 'nutrition-management', label: '🍎 Nutrition Management', href: '/admin/health/nutrition' },
      { id: 'mental-health', label: '🧘‍♀️ Mental Health', href: '/admin/health/mental' },
      { id: 'health-records', label: '💊 Health Records', href: '/admin/health/records' },
      { id: 'doctor-consultations', label: '👩‍⚕️ Doctor Consultations', href: '/admin/health/doctors' },
      { id: 'health-analytics', label: '📊 Health Analytics', href: '/admin/health/analytics' },
      { id: 'emergency-health', label: '🚨 Emergency Health', href: '/admin/health/emergency' },
      { id: 'sleep-tracking', label: '💤 Sleep Tracking', href: '/admin/health/sleep' },
      { id: 'symptom-checker', label: '🩺 Symptom Checker', href: '/admin/health/symptoms' },
      { id: 'hospital-finder', label: '🏥 Hospital Finder', href: '/admin/health/hospitals' }
    ]
  }
];