export default function ChefOverview() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card title="My Meals" />
      <Card title="Orders Received" />
      <Card title="Earnings" />
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
