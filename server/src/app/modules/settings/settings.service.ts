import prisma from '../../../prisma/client';

export const getSettings = async () => {
  let settings = await prisma.settings.findFirst();

  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        heroVideos: [],
        heroTitle: 'Find Your Dream Property',
        heroSubtitle: 'Connecting distinguished individuals with Bangladesh\'s most extraordinary architectural masterpieces.',
        sliderInterval: 8,
        sliderAutoPlay: true,
      },
    });
  }

  return settings;
};

export const updateSettings = async (data: {
  siteName?: string;
  logoUrl?: string;
  faviconUrl?: string;
  supportEmail?: string;
  bkashTrxId?: string;
  heroVideos?: string[];
  heroTitle?: string;
  heroSubtitle?: string;
  sliderInterval?: number;
  sliderAutoPlay?: boolean;
}) => {
  let settings = await prisma.settings.findFirst();

  if (!settings) {
    settings = await prisma.settings.create({
      data,
    });
  } else {
    settings = await prisma.settings.update({
      where: { id: settings.id },
      data,
    });
  }

  return settings;
};
