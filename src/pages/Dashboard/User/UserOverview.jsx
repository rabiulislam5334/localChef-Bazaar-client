export default function UserOverview() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card title="My Orders" />
      <Card title="Favorites" />
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
