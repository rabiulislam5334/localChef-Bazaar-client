export default function AdminOverview() {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      <Card title="Total Users" />
      <Card title="Total Orders" />
      <Card title="Total Chefs" />
      <Card title="Revenue" />
    </div>
  );
}

function Card({ title }) {
  return (
    <div className="bg-base-100 p-6 rounded-xl shadow">
      <p className="text-sm opacity-70">{title}</p>
      <h2 className="text-2xl font-bold">--</h2>
    </div>
  );
}
