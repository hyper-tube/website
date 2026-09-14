import { data } from 'react-router';

export function loader() {
  return data(
    { status: 'ok', uptime: Math.round(process.uptime()) },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
