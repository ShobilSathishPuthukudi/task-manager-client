import { useSelector } from "react-redux";

export default function Dashboard() {
  const authState = useSelector((state) => state.auth);

  return (
    <div style={{ padding: 20 }}>
      <h2>Redux Auth State:</h2>

      <pre>{JSON.stringify(authState, null, 2)}</pre>
    </div>
  );
}
