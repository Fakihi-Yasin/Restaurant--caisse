import { PrismaClient, Role, Station } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  // ---------- Tenant ----------
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'dar-demo' },
    update: {},
    create: {
      slug: 'dar-demo',
      name: 'Dar Demo',
      legalName: 'Dar Demo SARL',
      city: 'Fès',
      currency: 'MAD',
      vatRate: 10,
      receiptFooter: 'Merci de votre visite — شكراً لزيارتكم',
    },
  });

  // ---------- Users ----------
  const ownerHash = await argon2.hash('owner1234');
  const cashierPin = await argon2.hash('1111');
  const waiterPin  = await argon2.hash('2222');
  const kitchenPin = await argon2.hash('3333');

  const owner = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'owner@dar-demo.ma' } },
    update: {},
    create: { tenantId: tenant.id, name: 'Propriétaire', role: Role.OWNER, email: 'owner@dar-demo.ma', passwordHash: ownerHash },
  });

  const cashier = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'cashier@dar-demo.ma' } },
    update: {},
    create: { tenantId: tenant.id, name: 'Caissier', role: Role.CASHIER, email: 'cashier@dar-demo.ma', pinHash: cashierPin },
  });

  const waiter = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'waiter@dar-demo.ma' } },
    update: {},
    create: { tenantId: tenant.id, name: 'Serveur', role: Role.WAITER, email: 'waiter@dar-demo.ma', pinHash: waiterPin },
  });

  const kitchen = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'kitchen@dar-demo.ma' } },
    update: {},
    create: { tenantId: tenant.id, name: 'Cuisine', role: Role.KITCHEN, email: 'kitchen@dar-demo.ma', pinHash: kitchenPin },
  });

  // ---------- Categories ----------
  const categoryData = [
    { nameFr: 'Entrées',   nameAr: 'مقبلات',    sortOrder: 1 },
    { nameFr: 'Tajines',   nameAr: 'طاجين',     sortOrder: 2 },
    { nameFr: 'Couscous',  nameAr: 'كسكس',      sortOrder: 3 },
    { nameFr: 'Pastilla',  nameAr: 'بسطيلة',    sortOrder: 4 },
    { nameFr: 'Grillades', nameAr: 'مشويات',    sortOrder: 5 },
    { nameFr: 'Salades',   nameAr: 'سلطات',     sortOrder: 6 },
    { nameFr: 'Boissons',  nameAr: 'مشروبات',   sortOrder: 7 },
    { nameFr: 'Desserts',  nameAr: 'حلويات',    sortOrder: 8 },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoryData) {
    const existing = await prisma.category.findFirst({ where: { tenantId: tenant.id, nameFr: cat.nameFr } });
    const c = existing ?? await prisma.category.create({ data: { tenantId: tenant.id, ...cat } });
    categories[cat.nameFr] = c.id;
  }

  // ---------- Products ----------
  const productData: {
    nameFr: string; nameAr: string; priceCents: number;
    category: string; station: Station; sortOrder: number;
  }[] = [
    // Entrées
    { nameFr: 'Harira',                  nameAr: 'حريرة',                  priceCents: 2500,  category: 'Entrées',   station: Station.KITCHEN, sortOrder: 1 },
    { nameFr: 'Briouates au fromage',    nameAr: 'بريوات بالجبن',           priceCents: 3500,  category: 'Entrées',   station: Station.KITCHEN, sortOrder: 2 },
    { nameFr: 'Zaalouk',                 nameAr: 'زعلوك',                  priceCents: 2000,  category: 'Entrées',   station: Station.KITCHEN, sortOrder: 3 },
    // Tajines
    { nameFr: 'Tajine poulet aux olives',nameAr: 'طاجين دجاج بالزيتون',    priceCents: 8500,  category: 'Tajines',   station: Station.KITCHEN, sortOrder: 1 },
    { nameFr: 'Tajine kefta aux œufs',   nameAr: 'طاجين كفتة بالبيض',      priceCents: 7500,  category: 'Tajines',   station: Station.KITCHEN, sortOrder: 2 },
    { nameFr: 'Tajine agneau aux pruneaux', nameAr: 'طاجين لحم بالبرقوق',  priceCents: 9500,  category: 'Tajines',   station: Station.KITCHEN, sortOrder: 3 },
    { nameFr: 'Tajine légumes',          nameAr: 'طاجين خضروات',           priceCents: 6500,  category: 'Tajines',   station: Station.KITCHEN, sortOrder: 4 },
    // Couscous
    { nameFr: 'Couscous royal',          nameAr: 'كسكس ملكي',              priceCents: 11000, category: 'Couscous',  station: Station.KITCHEN, sortOrder: 1 },
    { nameFr: 'Couscous poulet',         nameAr: 'كسكس دجاج',              priceCents: 8500,  category: 'Couscous',  station: Station.KITCHEN, sortOrder: 2 },
    { nameFr: 'Couscous tfaya',          nameAr: 'كسكس تفاية',             priceCents: 9000,  category: 'Couscous',  station: Station.KITCHEN, sortOrder: 3 },
    // Pastilla
    { nameFr: 'Pastilla au poulet',      nameAr: 'بسطيلة بالدجاج',         priceCents: 9000,  category: 'Pastilla',  station: Station.KITCHEN, sortOrder: 1 },
    { nameFr: 'Pastilla aux fruits de mer', nameAr: 'بسطيلة بالمأكولات البحرية', priceCents: 11000, category: 'Pastilla', station: Station.KITCHEN, sortOrder: 2 },
    // Grillades
    { nameFr: 'Brochettes de kefta',     nameAr: 'كفتة مشوية',             priceCents: 6500,  category: 'Grillades', station: Station.KITCHEN, sortOrder: 1 },
    { nameFr: 'Brochettes d\'agneau',    nameAr: 'مشاوي لحم',              priceCents: 8000,  category: 'Grillades', station: Station.KITCHEN, sortOrder: 2 },
    { nameFr: 'Poulet grillé',           nameAr: 'دجاج مشوي',              priceCents: 7500,  category: 'Grillades', station: Station.KITCHEN, sortOrder: 3 },
    // Salades
    { nameFr: 'Salade marocaine',        nameAr: 'سلطة مغربية',            priceCents: 2500,  category: 'Salades',   station: Station.KITCHEN, sortOrder: 1 },
    { nameFr: 'Salade de carottes',      nameAr: 'سلطة جزر',               priceCents: 2000,  category: 'Salades',   station: Station.KITCHEN, sortOrder: 2 },
    { nameFr: 'Taktouka',                nameAr: 'تكتوكة',                 priceCents: 2000,  category: 'Salades',   station: Station.KITCHEN, sortOrder: 3 },
    // Boissons
    { nameFr: 'Thé à la menthe',         nameAr: 'أتاي بالنعناع',           priceCents: 1500,  category: 'Boissons',  station: Station.BAR,     sortOrder: 1 },
    { nameFr: 'Jus d\'orange frais',     nameAr: 'عصير برتقال طازج',        priceCents: 2500,  category: 'Boissons',  station: Station.BAR,     sortOrder: 2 },
    { nameFr: 'Eau minérale',            nameAr: 'ماء معدني',               priceCents: 1000,  category: 'Boissons',  station: Station.BAR,     sortOrder: 3 },
    { nameFr: 'Café',                    nameAr: 'قهوة',                   priceCents: 1500,  category: 'Boissons',  station: Station.BAR,     sortOrder: 4 },
    // Desserts
    { nameFr: 'Cornes de gazelle',       nameAr: 'كعب الغزال',             priceCents: 3000,  category: 'Desserts',  station: Station.KITCHEN, sortOrder: 1 },
    { nameFr: 'Chebakia',                nameAr: 'شباكية',                 priceCents: 2500,  category: 'Desserts',  station: Station.KITCHEN, sortOrder: 2 },
    { nameFr: 'Crème caramel',           nameAr: 'كريم كراميل',            priceCents: 3500,  category: 'Desserts',  station: Station.KITCHEN, sortOrder: 3 },
  ];

  const products: Record<string, string> = {};
  for (const p of productData) {
    const existing = await prisma.product.findFirst({ where: { tenantId: tenant.id, nameFr: p.nameFr } });
    const prod = existing ?? await prisma.product.create({
      data: { tenantId: tenant.id, categoryId: categories[p.category], nameFr: p.nameFr, nameAr: p.nameAr, priceCents: p.priceCents, station: p.station, sortOrder: p.sortOrder },
    });
    products[p.nameFr] = prod.id;
  }

  // ---------- Modifier groups ----------
  let grpSans = await prisma.modifierGroup.findFirst({ where: { tenantId: tenant.id, nameFr: 'Sans ...' } });
  if (!grpSans) {
    grpSans = await prisma.modifierGroup.create({
      data: {
        tenantId: tenant.id, nameFr: 'Sans ...', nameAr: 'بدون ...', required: false, multiple: true,
        modifiers: { create: [
          { nameFr: 'Sans oignon',  nameAr: 'بدون بصل',   priceDeltaCents: 0, sortOrder: 1 },
          { nameFr: 'Sans sel',     nameAr: 'بدون ملح',   priceDeltaCents: 0, sortOrder: 2 },
          { nameFr: 'Sans piment',  nameAr: 'بدون فلفل',  priceDeltaCents: 0, sortOrder: 3 },
        ]},
      },
    });
  }

  let grpTaille = await prisma.modifierGroup.findFirst({ where: { tenantId: tenant.id, nameFr: 'Taille' } });
  if (!grpTaille) {
    grpTaille = await prisma.modifierGroup.create({
      data: {
        tenantId: tenant.id, nameFr: 'Taille', nameAr: 'الحجم', required: true, multiple: false,
        modifiers: { create: [
          { nameFr: 'Petite',   nameAr: 'صغير',  priceDeltaCents: -1000, sortOrder: 1 },
          { nameFr: 'Normale',  nameAr: 'عادي',  priceDeltaCents: 0,     sortOrder: 2 },
          { nameFr: 'Grande',   nameAr: 'كبير',  priceDeltaCents: 1500,  sortOrder: 3 },
        ]},
      },
    });
  }

  // Link modifier groups to some products (idempotent via upsert on composite PK)
  const productsWithSans   = ['Harira', 'Tajine poulet aux olives', 'Tajine kefta aux œufs', 'Couscous royal', 'Couscous poulet'];
  const productsWithTaille = ['Thé à la menthe', 'Jus d\'orange frais', 'Café'];

  for (const name of productsWithSans) {
    if (!products[name]) continue;
    await prisma.productModifierGroup.upsert({
      where: { productId_groupId: { productId: products[name], groupId: grpSans.id } },
      update: {}, create: { productId: products[name], groupId: grpSans.id },
    });
  }
  for (const name of productsWithTaille) {
    if (!products[name]) continue;
    await prisma.productModifierGroup.upsert({
      where: { productId_groupId: { productId: products[name], groupId: grpTaille.id } },
      update: {}, create: { productId: products[name], groupId: grpTaille.id },
    });
  }

  // ---------- Tables ----------
  const tableData = [
    { name: 'T1', zone: 'Salon' }, { name: 'T2', zone: 'Salon' }, { name: 'T3', zone: 'Salon' },
    { name: 'T4', zone: 'Salon' }, { name: 'T5', zone: 'Salon' },
    { name: 'T6', zone: 'Terrasse' }, { name: 'T7', zone: 'Terrasse' }, { name: 'T8', zone: 'Terrasse' },
    { name: 'T9', zone: 'Terrasse' }, { name: 'T10', zone: 'Terrasse' },
  ];
  for (const t of tableData) {
    await prisma.diningTable.upsert({
      where: { tenantId_name: { tenantId: tenant.id, name: t.name } },
      update: {}, create: { tenantId: tenant.id, ...t },
    });
  }

  // ---------- Print credentials ----------
  console.log('\n✅ Seed complete!\n');
  console.log('Tenant slug : dar-demo');
  console.log('─────────────────────────────────────────');
  console.log(`OWNER    email: owner@dar-demo.ma   password: owner1234`);
  console.log(`CASHIER  id: ${cashier.id}   PIN: 1111`);
  console.log(`WAITER   id: ${waiter.id}   PIN: 2222`);
  console.log(`KITCHEN  id: ${kitchen.id}   PIN: 3333`);
  console.log('─────────────────────────────────────────');
  console.log(`Categories : ${Object.keys(categories).length}`);
  console.log(`Products   : ${Object.keys(products).length}`);
  console.log(`Tables     : ${tableData.length} (Salon + Terrasse)`);
  console.log('');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
