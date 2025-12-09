export default function Badge({ children, color = "gray" }: any) {
  const base = "inline-flex items-center px-2 py-1 rounded text-xs font-medium";
  const colors: any = {
    gray: "bg-gray-200 text-gray-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
    blue: "bg-blue-100 text-blue-800",
  };

  return <span className={`${base} ${colors[color] || colors.gray}`}>{children}</span>;
}
