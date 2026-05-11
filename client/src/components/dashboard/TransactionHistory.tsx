'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  CreditCard, 
  ArrowUpRight, 
  Filter, 
  Search, 
  Calendar,
  Wallet,
  Receipt,
  FileText
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axiosInstance.get('/bookings/transactions');
        setTransactions(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(trx => 
    trx.trxId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trx.booking?.property?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 md:h-20 lg:h-24 w-full rounded-xl lg:rounded-2xl bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mb-2">Financial Ledger</h2>
          <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em]">Asset Acquisition History</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input 
            placeholder="Search by TRX ID or Property..." 
            className="pl-12 bg-white/5 border-white/10 rounded-xl h-10 md:h-12 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card/30 backdrop-blur-xl border border-white/5 rounded-xl lg:rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto min-w-[600px]">
          <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-12 md:h-14 pl-4 md:pl-8">Transaction Details</TableHead>
              <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-12 md:h-14 hidden sm:table-cell">Residence</TableHead>
              <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-12 md:h-14">Amount</TableHead>
              <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-12 md:h-14">Status</TableHead>
              <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-12 md:h-14 text-right pr-4 md:pr-8">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? filteredTransactions.map((trx) => (
              <TableRow key={trx.id} className="border-white/5 hover:bg-white/2 transition-colors">
                <TableCell className="py-4 md:py-6 pl-4 md:pl-8">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-8 md:w-10 h-8 md:h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Receipt size={16} />
                    </div>
                    <div>
                      <p className="text-white font-black tracking-tight text-sm mb-1">{trx.trxId || 'PENDING'}</p>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{trx.method}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <p className="text-white font-bold text-sm">{trx.booking?.property?.title || 'Unknown Asset'}</p>
                </TableCell>
                <TableCell>
                  <p className="text-white font-black tracking-tight text-sm md:text-base">৳{trx.amount.toLocaleString()}</p>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={`rounded-full px-3 md:px-4 py-0.5 md:py-1 text-[9px] font-black uppercase tracking-widest border-0 ${
                      trx.status === 'COMPLETED' 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : trx.status === 'FAILED'
                        ? 'bg-rose-500/10 text-rose-500'
                        : 'bg-amber-500/10 text-amber-500'
                    }`}
                  >
                    {trx.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-4 md:pr-8 text-muted-foreground text-xs font-bold">
                  {new Date(trx.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="py-12 md:py-20 text-center text-muted-foreground italic">
                  No transaction history found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
      </div>
    </div>
  );
}
