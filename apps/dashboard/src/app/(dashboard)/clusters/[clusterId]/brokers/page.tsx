import type { Metadata } from 'next'
import { Badge } from '@workspace/ui/components/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table'

export const metadata: Metadata = {
  title: 'Brokers',
}

// Placeholder data — replace with real API call
const mockBrokers = [
  { id: 1, host: 'broker-1.kafka.internal', port: 9092, status: 'healthy', partitions: 24 },
  { id: 2, host: 'broker-2.kafka.internal', port: 9092, status: 'healthy', partitions: 23 },
  { id: 3, host: 'broker-3.kafka.internal', port: 9092, status: 'healthy', partitions: 24 },
]

export default function BrokersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Brokers</h1>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-foreground">Broker Management</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">View and manage brokers in this cluster.</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">ID</TableHead>
              <TableHead className="text-muted-foreground">Host</TableHead>
              <TableHead className="text-muted-foreground">Port</TableHead>
              <TableHead className="text-muted-foreground">Partitions</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockBrokers.map((broker) => (
              <TableRow key={broker.id} className="border-border hover:bg-muted/50">
                <TableCell className="font-mono text-foreground">{broker.id}</TableCell>
                <TableCell className="font-mono text-foreground">{broker.host}</TableCell>
                <TableCell className="font-mono text-muted-foreground">{broker.port}</TableCell>
                <TableCell className="text-foreground">{broker.partitions}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      broker.status === 'healthy'
                        ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10'
                        : 'border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/10'
                    }
                  >
                    {broker.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
