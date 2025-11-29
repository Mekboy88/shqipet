export interface Photo {
  id: string;
  url: string;
  thumbnail: string;
}

export interface Album {
  id: string;
  name: string;
  photoCount: number;
  thumbnail: string;
  photos: Photo[];
}

export const first12Photos = [
  {
    id: '1',
    url: '/lovable-uploads/63fd1c8c-9351-44eb-b06d-b051c2508e9a.png',
    thumbnail: '/lovable-uploads/63fd1c8c-9351-44eb-b06d-b051c2508e9a.png'
  },
  {
    id: '2',
    url: '/lovable-uploads/997db93f-9189-4e4b-83bb-e0e4ab88bfe1.png',
    thumbnail: '/lovable-uploads/997db93f-9189-4e4b-83bb-e0e4ab88bfe1.png'
  },
  {
    id: '3',
    url: '/lovable-uploads/e2a64c5d-d5e8-43c1-8ac8-15f97ea8c7f9.png',
    thumbnail: '/lovable-uploads/e2a64c5d-d5e8-43c1-8ac8-15f97ea8c7f9.png'
  },
  {
    id: '4',
    url: '/lovable-uploads/7e8ca301-17eb-4943-8964-ebb9705daf6e.png',
    thumbnail: '/lovable-uploads/7e8ca301-17eb-4943-8964-ebb9705daf6e.png'
  },
  {
    id: '5',
    url: '/lovable-uploads/be66673c-a7c6-45a4-a639-abe177ec5720.png',
    thumbnail: '/lovable-uploads/be66673c-a7c6-45a4-a639-abe177ec5720.png'
  },
  {
    id: '6',
    url: '/lovable-uploads/b9759f24-9f31-4523-a360-2ef8c2e6e824.png',
    thumbnail: '/lovable-uploads/b9759f24-9f31-4523-a360-2ef8c2e6e824.png'
  },
  {
    id: '7',
    url: '/lovable-uploads/180ab2b8-03e3-446e-b233-b83f47160731.png',
    thumbnail: '/lovable-uploads/180ab2b8-03e3-446e-b233-b83f47160731.png'
  },
  {
    id: '8',
    url: '/lovable-uploads/982a77f2-448d-4120-88f6-864d050e7f8d.png',
    thumbnail: '/lovable-uploads/982a77f2-448d-4120-88f6-864d050e7f8d.png'
  },
  {
    id: '9',
    url: '/lovable-uploads/77cd896c-0c4b-49c3-9cd5-027628006b6f.png',
    thumbnail: '/lovable-uploads/77cd896c-0c4b-49c3-9cd5-027628006b6f.png'
  },
  {
    id: '10',
    url: '/lovable-uploads/1bbe811f-f60f-46b4-a110-736f5121ebcc.png',
    thumbnail: '/lovable-uploads/1bbe811f-f60f-46b4-a110-736f5121ebcc.png'
  },
  {
    id: '11',
    url: '/lovable-uploads/b686e266-dba0-47bd-9219-071743d76d0c.png',
    thumbnail: '/lovable-uploads/b686e266-dba0-47bd-9219-071743d76d0c.png'
  },
  {
    id: '12',
    url: '/lovable-uploads/60267202-c7f6-467a-a913-68a49b588f70.png',
    thumbnail: '/lovable-uploads/60267202-c7f6-467a-a913-68a49b588f70.png'
  },
];

// Extended photo data for testing scroll functionality
export const recentPhotos = [
  {
    id: '1',
    url: '/lovable-uploads/63fd1c8c-9351-44eb-b06d-b051c2508e9a.png',
    thumbnail: '/lovable-uploads/63fd1c8c-9351-44eb-b06d-b051c2508e9a.png'
  },
  {
    id: '2',
    url: '/lovable-uploads/997db93f-9189-4e4b-83bb-e0e4ab88bfe1.png',
    thumbnail: '/lovable-uploads/997db93f-9189-4e4b-83bb-e0e4ab88bfe1.png'
  },
  {
    id: '3',
    url: '/lovable-uploads/e2a64c5d-d5e8-43c1-8ac8-15f97ea8c7f9.png',
    thumbnail: '/lovable-uploads/e2a64c5d-d5e8-43c1-8ac8-15f97ea8c7f9.png'
  },
  {
    id: '4',
    url: '/lovable-uploads/7e8ca301-17eb-4943-8964-ebb9705daf6e.png',
    thumbnail: '/lovable-uploads/7e8ca301-17eb-4943-8964-ebb9705daf6e.png'
  },
  {
    id: '5',
    url: '/lovable-uploads/be66673c-a7c6-45a4-a639-abe177ec5720.png',
    thumbnail: '/lovable-uploads/be66673c-a7c6-45a4-a639-abe177ec5720.png'
  },
  {
    id: '6',
    url: '/lovable-uploads/b9759f24-9f31-4523-a360-2ef8c2e6e824.png',
    thumbnail: '/lovable-uploads/b9759f24-9f31-4523-a360-2ef8c2e6e824.png'
  },
  {
    id: '7',
    url: '/lovable-uploads/180ab2b8-03e3-446e-b233-b83f47160731.png',
    thumbnail: '/lovable-uploads/180ab2b8-03e3-446e-b233-b83f47160731.png'
  },
  {
    id: '8',
    url: '/lovable-uploads/982a77f2-448d-4120-88f6-864d050e7f8d.png',
    thumbnail: '/lovable-uploads/982a77f2-448d-4120-88f6-864d050e7f8d.png'
  },
  {
    id: '9',
    url: '/lovable-uploads/77cd896c-0c4b-49c3-9cd5-027628006b6f.png',
    thumbnail: '/lovable-uploads/77cd896c-0c4b-49c3-9cd5-027628006b6f.png'
  },
  {
    id: '10',
    url: '/lovable-uploads/1bbe811f-f60f-46b4-a110-736f5121ebcc.png',
    thumbnail: '/lovable-uploads/1bbe811f-f60f-46b4-a110-736f5121ebcc.png'
  },
  {
    id: '11',
    url: '/lovable-uploads/b686e266-dba0-47bd-9219-071743d76d0c.png',
    thumbnail: '/lovable-uploads/b686e266-dba0-47bd-9219-071743d76d0c.png'
  },
  {
    id: '12',
    url: '/lovable-uploads/60267202-c7f6-467a-a913-68a49b588f70.png',
    thumbnail: '/lovable-uploads/60267202-c7f6-467a-a913-68a49b588f70.png'
  },
  // Additional photos to ensure scrollable content
  {
    id: '13',
    url: '/lovable-uploads/136957d8-00c6-4829-b29e-05e6ab7d13f0.png',
    thumbnail: '/lovable-uploads/136957d8-00c6-4829-b29e-05e6ab7d13f0.png'
  },
  {
    id: '14',
    url: '/lovable-uploads/14bbee8c-16f1-450c-8466-1f1836312889.png',
    thumbnail: '/lovable-uploads/14bbee8c-16f1-450c-8466-1f1836312889.png'
  },
  {
    id: '15',
    url: '/lovable-uploads/1bc71557-f0c2-46ac-bf2a-cb98cfacc9f5.png',
    thumbnail: '/lovable-uploads/1bc71557-f0c2-46ac-bf2a-cb98cfacc9f5.png'
  },
  {
    id: '16',
    url: '/lovable-uploads/2879e10b-6a47-4a92-834f-65b2b9d621da.png',
    thumbnail: '/lovable-uploads/2879e10b-6a47-4a92-834f-65b2b9d621da.png'
  },
  {
    id: '17',
    url: '/lovable-uploads/34cc965b-9d15-4057-aa7f-912dd440198d.png',
    thumbnail: '/lovable-uploads/34cc965b-9d15-4057-aa7f-912dd440198d.png'
  },
  {
    id: '18',
    url: '/lovable-uploads/3bd91a9f-e775-4673-a5e1-420115add8c5.png',
    thumbnail: '/lovable-uploads/3bd91a9f-e775-4673-a5e1-420115add8c5.png'
  },
  {
    id: '19',
    url: '/lovable-uploads/464a04ea-4601-4d2e-9b94-6a66f4c1e3db.png',
    thumbnail: '/lovable-uploads/464a04ea-4601-4d2e-9b94-6a66f4c1e3db.png'
  },
  {
    id: '20',
    url: '/lovable-uploads/4b5fe65d-90dc-4902-b833-ac32d7616acd.png',
    thumbnail: '/lovable-uploads/4b5fe65d-90dc-4902-b833-ac32d7616acd.png'
  },
  {
    id: '21',
    url: '/lovable-uploads/8e482f73-44b3-4ca2-8aaf-a9657f2cff21.png',
    thumbnail: '/lovable-uploads/8e482f73-44b3-4ca2-8aaf-a9657f2cff21.png'
  },
  {
    id: '22',
    url: '/lovable-uploads/97644cc0-2bd5-4b5e-9ea4-0e79e668c003.png',
    thumbnail: '/lovable-uploads/97644cc0-2bd5-4b5e-9ea4-0e79e668c003.png'
  },
  {
    id: '23',
    url: '/lovable-uploads/a11547b9-eaab-467e-9a4d-af5a7699c752.png',
    thumbnail: '/lovable-uploads/a11547b9-eaab-467e-9a4d-af5a7699c752.png'
  },
  {
    id: '24',
    url: '/lovable-uploads/b684a7d6-bd4d-458c-a95b-e64f259d1ea4.png',
    thumbnail: '/lovable-uploads/b684a7d6-bd4d-458c-a95b-e64f259d1ea4.png'
  }
];

export const albums = [
  {
    id: 'cover',
    name: 'Cover Photos',
    photoCount: 8,
    thumbnail: '/lovable-uploads/63fd1c8c-9351-44eb-b06d-b051c2508e9a.png',
    photos: recentPhotos.slice(0, 8)
  },
  {
    id: 'profile',
    name: 'Profile Pictures',
    photoCount: 6,
    thumbnail: '/lovable-uploads/997db93f-9189-4e4b-83bb-e0e4ab88bfe1.png',
    photos: recentPhotos.slice(8, 14)
  },
  {
    id: 'posts',
    name: 'Posts',
    photoCount: 10,
    thumbnail: '/lovable-uploads/e2a64c5d-d5e8-43c1-8ac8-15f97ea8c7f9.png',
    photos: recentPhotos.slice(14, 24)
  }
];
