"use client";

import { useRouter } from 'next/navigation';

export default function VehicleSelect({ 
  selectedIds, 
  allEvs 
}: { 
  selectedIds: string[], 
  allEvs: {id: string, brand: string, model: string}[] 
}) {
  const router = useRouter();

  return (
    <select 
      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
      onChange={(e) => {
        const newIds = [...selectedIds, e.target.value].join(',');
        router.push(`/compare?ids=${newIds}`);
      }}
      defaultValue=""
    >
      <option value="" disabled>Pilih EV...</option>
      {allEvs.filter(e => !selectedIds.includes(e.id)).map(e => (
        <option key={e.id} value={e.id}>{e.brand} {e.model}</option>
      ))}
    </select>
  );
}
