export default function Card({ children, className = "" }: any) {
  return (
    <div className={"bg-white p-4 rounded shadow " + className}>{children}</div>
  );
}
