import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { PhotoGalleryCard } from '../../components/common/PhotoGalleryCard';
import { Search, Filter, PackageCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiClient } from '../../services/api';

export const MaterialHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [materials, setMaterials] = useState([
    {
      id: 'mat-1',
      materialType: 'UltraTech 53 Grade Cement',
      quantity: '150 bags',
      unit: 'bags',
      status: 'Verified',
      imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=60',
      uploader: 'Apex Builders',
      date: new Date().toISOString(),
      notes: 'Approximately 150 cement bags detected with 96% confidence.'
    },
    {
      id: 'mat-2',
      materialType: 'Fe-550D TMT Steel Rebar',
      quantity: '4 Metric Tons',
      unit: 'tons',
      status: 'Verified',
      imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=60',
      uploader: 'Apex Builders',
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      notes: 'Bundles checked on flatbed trailer. Visible quantity conforms to dispatch invoice.'
    },
    {
      id: 'mat-3',
      materialType: 'First-Class Red Clay Bricks',
      quantity: '4,000 units',
      unit: 'bricks',
      status: 'Discrepancy Detected',
      imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=60',
      uploader: 'Apex Builders',
      date: new Date(Date.now() - 86400000 * 4).toISOString(),
      notes: 'Visible count appears closer to 3,200 bricks. Some stacks may be positioned behind the main wall.'
    },
    {
      id: 'mat-4',
      materialType: 'Coarse River Sand',
      quantity: '12 Metric Tons',
      unit: 'tons',
      status: 'Verified',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60',
      uploader: 'Apex Builders',
      date: new Date(Date.now() - 86400000 * 7).toISOString(),
      notes: 'Dumper delivery volume checked against bed height marks.'
    }
  ]);

  useEffect(() => {
    async function loadMaterials() {
      const res = await apiClient.getMaterialHistory('65f000000000000000000010', page, 8);
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        // Hydrate from live backend if online
        const formatted = res.data.map(m => ({
          id: m._id || m.id,
          materialType: m.materialType,
          quantity: `${m.quantity} ${m.unit || 'units'}`,
          status: m.aiVerificationResult?.status || 'Verified',
          imageUrl: m.imageUrl,
          uploader: m.uploadedBy?.name || 'Contractor',
          date: m.uploadDate,
          notes: m.aiVerificationResult?.notes || 'AI inspection verified.'
        }));
        setMaterials(formatted);
      }
    }
    loadMaterials();
  }, [page]);

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.materialType.toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'VERIFIED') return matchesSearch && m.status === 'Verified';
    if (statusFilter === 'DISCREPANCY') return matchesSearch && m.status.includes('Discrepancy');
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900">
          Material Delivery History
        </h1>
        <p className="text-sm md:text-base text-slate-500 mt-1">
          Every building supply logged on-site with photographic proof & computer vision audits.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search by material (e.g. Cement, Steel, Bricks)..."
              icon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({materials.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('VERIFIED')}
              className={`px-3 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                statusFilter === 'VERIFIED'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Verified
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('DISCREPANCY')}
              className={`px-3 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                statusFilter === 'DISCREPANCY'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Notes / Variations
            </button>
          </div>
        </div>
      </Card>

      {/* Material Delivery Grid */}
      {filteredMaterials.length === 0 ? (
        <Card className="text-center py-12 space-y-3">
          <PackageCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No matching deliveries found</h3>
          <p className="text-sm text-slate-500">Try adjusting your search or filter keywords.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((item) => (
            <PhotoGalleryCard
              key={item.id}
              title={item.materialType}
              subtitle={item.notes}
              date={item.date}
              uploader={item.uploader}
              status={item.status}
              metricValue={item.quantity}
              imageUrl={item.imageUrl}
              statusNote={item.notes}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <span className="text-sm text-slate-500 font-medium">
          Showing {filteredMaterials.length} deliveries (Page {page})
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            icon={ChevronLeft}
          >
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => p + 1)}
            className="flex-row-reverse"
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
