import prisma from '../../../prisma/client';

export const getSettings = async () => {
  let settings = await prisma.settings.findFirst();

  if (!settings) {
    settings = await prisma.settings.create({
      data: {},
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
