import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { useAuthStore } from '../../store/auth.store';
import { db } from '../../lib/db';

type Category = { id: string; nameFr: string; nameAr?: string; sortOrder: number; active: boolean };
type Product  = { id: string; categoryId: string; nameFr: string; nameAr?: string; priceCents: number; station: string; available: boolean; sortOrder: number };
type MenuItem = Category & { products: (Product & { modifierGroups: unknown[] })[] };

function madToCents(mad: string) { return Math.round(parseFloat(mad) * 100); }
function centsToMad(c: number)   { return (c / 100).toFixed(2); }

export default function AdminPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { logout } = useAuthStore();
  const [tab, setTab] = useState<'categories' | 'products'>('products');

  // Fetch full menu and cache in Dexie
  const { data: menu = [] } = useQuery<MenuItem[]>({
    queryKey: ['menu'],
    queryFn: async () => {
      const res = await api.get('/menu');
      const items: MenuItem[] = res.data;
      // Cache products in IndexedDB
      const flat = items.flatMap((cat) =>
        cat.products.map((p) => ({ ...p, categoryId: cat.id, cachedAt: Date.now() }))
      );
      await db.menuCache.clear();
      await db.menuCache.bulkPut(flat);
      return items;
    },
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => api.get('/menu/categories').then((r) => r.data),
  });

  // Category mutations
  const [catForm, setCatForm] = useState({ nameFr: '', nameAr: '' });
  const [editCat, setEditCat] = useState<Category | null>(null);

  const saveCat = useMutation({
    mutationFn: (data: { nameFr: string; nameAr: string }) =>
      editCat
        ? api.patch(`/menu/categories/${editCat.id}`, data).then((r) => r.data)
        : api.post('/menu/categories', data).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); qc.invalidateQueries({ queryKey: ['menu'] }); setCatForm({ nameFr: '', nameAr: '' }); setEditCat(null); },
  });

  const deleteCat = useMutation({
    mutationFn: (id: string) => api.delete(`/menu/categories/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); qc.invalidateQueries({ queryKey: ['menu'] }); },
  });

  // Product mutations
  const [prodForm, setProdForm] = useState({ nameFr: '', nameAr: '', priceMad: '', categoryId: '', station: 'KITCHEN' });
  const [editProd, setEditProd] = useState<Product | null>(null);

  const allProducts = menu.flatMap((c) => c.products);

  const saveProd = useMutation({
    mutationFn: (data: object) =>
      editProd
        ? api.patch(`/menu/products/${editProd.id}`, data).then((r) => r.data)
        : api.post('/menu/products', data).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['menu'] }); setProdForm({ nameFr: '', nameAr: '', priceMad: '', categoryId: '', station: 'KITCHEN' }); setEditProd(null); },
  });

  const toggleAvail = useMutation({
    mutationFn: ({ id, available }: { id: string; available: boolean }) =>
      api.patch(`/menu/products/${id}/availability`, { available }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['menu'] }),
  });

  const deleteProd = useMutation({
    mutationFn: (id: string) => api.delete(`/menu/products/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['menu'] }),
  });

  function startEditCat(c: Category) { setEditCat(c); setCatForm({ nameFr: c.nameFr, nameAr: c.nameAr ?? '' }); }
  function startEditProd(p: Product) {
    setEditProd(p);
    setProdForm({ nameFr: p.nameFr, nameAr: p.nameAr ?? '', priceMad: centsToMad(p.priceCents), categoryId: p.categoryId, station: p.station });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-amber-800 text-white px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold">{t('admin.title')}</h1>
        <button onClick={logout} className="text-sm opacity-80 hover:opacity-100">{t('nav.logout')}</button>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        {(['products', 'categories'] as const).map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${tab === tb ? 'border-amber-700 text-amber-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {t(`admin.${tb}`)}
          </button>
        ))}
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">

        {/* ---- CATEGORIES ---- */}
        {tab === 'categories' && (
          <>
            <form
              onSubmit={(e) => { e.preventDefault(); saveCat.mutate(catForm); }}
              className="bg-white rounded-xl p-4 shadow-sm space-y-3"
            >
              <h2 className="font-semibold text-gray-700">{editCat ? t('common.edit') : t('admin.addCategory')}</h2>
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder={t('admin.nameFr')} value={catForm.nameFr} onChange={(e) => setCatForm({ ...catForm, nameFr: e.target.value })}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                <input placeholder={t('admin.nameAr')} value={catForm.nameAr} onChange={(e) => setCatForm({ ...catForm, nameAr: e.target.value })}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" dir="rtl" />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-amber-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-800">{t('common.save')}</button>
                {editCat && <button type="button" onClick={() => { setEditCat(null); setCatForm({ nameFr: '', nameAr: '' }); }} className="px-4 py-2 rounded-lg text-sm border">{t('common.cancel')}</button>}
              </div>
            </form>

            <div className="bg-white rounded-xl shadow-sm divide-y">
              {categories.map((c) => (
                <div key={c.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <span className="font-medium">{c.nameFr}</span>
                    {c.nameAr && <span className="ml-2 text-gray-400 text-sm" dir="rtl">{c.nameAr}</span>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEditCat(c)} className="text-sm text-amber-700 hover:underline">{t('common.edit')}</button>
                    <button onClick={() => deleteCat.mutate(c.id)} className="text-sm text-red-500 hover:underline">{t('common.delete')}</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ---- PRODUCTS ---- */}
        {tab === 'products' && (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveProd.mutate({ nameFr: prodForm.nameFr, nameAr: prodForm.nameAr || undefined, priceCents: madToCents(prodForm.priceMad), categoryId: prodForm.categoryId, station: prodForm.station });
              }}
              className="bg-white rounded-xl p-4 shadow-sm space-y-3"
            >
              <h2 className="font-semibold text-gray-700">{editProd ? t('common.edit') : t('admin.addProduct')}</h2>
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder={t('admin.nameFr')} value={prodForm.nameFr} onChange={(e) => setProdForm({ ...prodForm, nameFr: e.target.value })}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                <input placeholder={t('admin.nameAr')} value={prodForm.nameAr} onChange={(e) => setProdForm({ ...prodForm, nameAr: e.target.value })}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" dir="rtl" />
                <input required type="number" step="0.01" min="0" placeholder={t('admin.price')} value={prodForm.priceMad} onChange={(e) => setProdForm({ ...prodForm, priceMad: e.target.value })}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                <select required value={prodForm.categoryId} onChange={(e) => setProdForm({ ...prodForm, categoryId: e.target.value })}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                  <option value="">{t('admin.category')}</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.nameFr}</option>)}
                </select>
                <select value={prodForm.station} onChange={(e) => setProdForm({ ...prodForm, station: e.target.value })}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                  <option value="KITCHEN">Cuisine</option>
                  <option value="BAR">Bar</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-amber-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-800">{t('common.save')}</button>
                {editProd && <button type="button" onClick={() => { setEditProd(null); setProdForm({ nameFr: '', nameAr: '', priceMad: '', categoryId: '', station: 'KITCHEN' }); }} className="px-4 py-2 rounded-lg text-sm border">{t('common.cancel')}</button>}
              </div>
            </form>

            <div className="bg-white rounded-xl shadow-sm divide-y">
              {allProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <span className="font-medium">{p.nameFr}</span>
                    {p.nameAr && <span className="ml-2 text-gray-400 text-sm" dir="rtl">{p.nameAr}</span>}
                    <span className="ml-3 text-amber-700 font-semibold text-sm">{centsToMad(p.priceCents)} MAD</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => toggleAvail.mutate({ id: p.id, available: !p.available })}
                      className={`text-xs px-2 py-1 rounded-full font-medium ${p.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}
                    >
                      {p.available ? t('admin.available') : '✗'}
                    </button>
                    <button onClick={() => startEditProd(p)} className="text-sm text-amber-700 hover:underline">{t('common.edit')}</button>
                    <button onClick={() => deleteProd.mutate(p.id)} className="text-sm text-red-500 hover:underline">{t('common.delete')}</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
