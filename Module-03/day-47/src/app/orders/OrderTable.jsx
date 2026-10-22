
import Link from 'next/link';

export default function OrderTable({ orders, searchParams }) {
  const sortBy = searchParams?.sort || 'date';
  const order = searchParams?.order || 'asc';
  const page = Number(searchParams?.page) || 1;
  const pageSize = 5;

  // Sorting logic
  const sortedOrders = [...orders].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return order === 'asc' ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return order === 'asc' ? 1 : -1;
    return 0;
  });

  // Paging logic
  const paginatedOrders = sortedOrders.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(orders.length / pageSize);

  const toggleSort = (column) => {
    const nextOrder = sortBy === column && order === 'asc' ? 'desc' : 'asc';
    return `?sort=${column}&order=${nextOrder}&page=1`;
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-stone-800 text-stone-400">
              <th className="py-3 px-4">
                <Link href={toggleSort('id')} className="hover:text-amber-400">Order ID ↕</Link>
              </th>
              <th className="py-3 px-4">
                <Link href={toggleSort('customer')} className="hover:text-amber-400">Customer ↕</Link>
              </th>
              <th className="py-3 px-4">Neighborhood</th>
              <th className="py-3 px-4">
                <Link href={toggleSort('total')} className="hover:text-amber-400">Total (ETB) ↕</Link>
              </th>
              <th className="py-3 px-4">
                <Link href={toggleSort('date')} className="hover:text-amber-400">Date ↕</Link>
              </th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((o) => (
              <tr key={o.id} className="border-b border-stone-800/60 hover:bg-stone-800/40">
                <td className="py-3 px-4 font-medium text-amber-500">{o.id}</td>
                <td className="py-3 px-4">{o.customer}</td>
                <td className="py-3 px-4 text-stone-300">{o.neighborhood}</td>
                <td className="py-3 px-4 font-semibold">{o.total} ETB</td>
                <td className="py-3 px-4 text-stone-400">{o.date}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    o.status === 'Delivered' ? 'bg-green-900/50 text-green-300 border border-green-700' :
                    o.status === 'Processing' ? 'bg-amber-900/50 text-amber-300 border border-amber-700' :
                    'bg-red-900/50 text-red-300 border border-red-700'
                  }`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Links */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-stone-800 text-sm">
        <span className="text-stone-400">Page {page} of {totalPages || 1}</span>
        <div className="flex gap-2">
          {page > 1 && (
            <Link href={`?sort=${sortBy}&order=${order}&page=${page - 1}`} className="px-3 py-1 bg-stone-800 hover:bg-stone-700 rounded text-stone-200">
              Previous
            </Link>
          )}
          {page < totalPages && (
            <Link href={`?sort=${sortBy}&order=${order}&page=${page + 1}`} className="px-3 py-1 bg-amber-600 hover:bg-amber-700 rounded text-white">
              Next
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}