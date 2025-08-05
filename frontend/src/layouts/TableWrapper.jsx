import React from "react";

const TableWrapper = ({ title, description, columns = [], data = [], actions }) => {
  return (
    <div className="rounded-3xl border border-gray-100  shadow-sm overflow-hidden bg-white transition-all duration-300">
      {(title || description || actions) && (
        <div className="px-6 py-4 border-b bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            {title && <h2 className="text-lg font-semibold text-gray-800">{title}</h2>}
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs border-b border-gray-200">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-3 whitespace-nowrap font-medium tracking-wide text-left">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-6 text-center text-gray-400 text-sm">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((item,index) => (
                <tr
                  key={item.id}
                  className="hover:bg-blue-50/30 transition-colors duration-200"
                >
                 
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {typeof col.render === "function"
                        ? col.render(item,index)
                        : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableWrapper;
