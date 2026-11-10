'use client'

import {
  MessageSquare,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@kangiten/ui/components/ui/card'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

// Mock data - in production, fetch from API
const stats = [
  { label: 'Total Conversations', value: '1,234', change: '+12%', trend: 'up', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Leads Captured', value: '89', change: '+23%', trend: 'up', icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Appointments Booked', value: '67', change: '+8%', trend: 'up', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-100' },
  { label: 'Avg Response Time', value: '12s', change: '-15%', trend: 'up', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
]

const conversationData = [
  { date: 'Mon', conversations: 45, automated: 38, handoff: 7 },
  { date: 'Tue', conversations: 52, automated: 44, handoff: 8 },
  { date: 'Wed', conversations: 48, automated: 42, handoff: 6 },
  { date: 'Thu', conversations: 61, automated: 53, handoff: 8 },
  { date: 'Fri', conversations: 73, automated: 65, handoff: 8 },
  { date: 'Sat', conversations: 58, automated: 50, handoff: 8 },
  { date: 'Sun', conversations: 32, automated: 28, handoff: 4 },
]

const leadSources = [
  { name: 'WhatsApp Organic', value: 45, color: '#22c55e' },
  { name: 'Website Widget', value: 23, color: '#3b82f6' },
  { name: 'Instagram', value: 15, color: '#e11d48' },
  { name: 'Referral', value: 12, color: '#f59e0b' },
  { name: 'Other', value: 8, color: '#64748b' },
]

const hourlyData = [
  { hour: '6AM', messages: 12 },
  { hour: '8AM', messages: 34 },
  { hour: '10AM', messages: 67 },
  { hour: '12PM', messages: 89 },
  { hour: '2PM', messages: 78 },
  { hour: '4PM', messages: 92 },
  { hour: '6PM', messages: 85 },
  { hour: '8PM', messages: 54 },
  { hour: '10PM', messages: 23 },
]

const recentConversations = [
  { id: '1', customer: 'Priya Sharma', phone: '+91 98765 43210', lastMessage: 'Thanks! Confirmed for Friday 3pm', time: '2 min ago', status: 'completed', unread: 0 },
  { id: '2', customer: 'Rahul Kumar', phone: '+91 87654 32109', lastMessage: 'What are your facial prices?', time: '15 min ago', status: 'active', unread: 2 },
  { id: '3', customer: 'Anita Desai', phone: '+91 76543 21098', lastMessage: 'I need to reschedule my appointment', time: '1 hour ago', status: 'active', unread: 1 },
  { id: '4', customer: 'Vikram Singh', phone: '+91 65432 10987', lastMessage: 'Do you do bridal makeup?', time: '3 hours ago', status: 'completed', unread: 0 },
  { id: '5', customer: 'Meera Patel', phone: '+91 54321 09876', lastMessage: 'Can I book for Saturday morning?', time: '5 hours ago', status: 'handoff', unread: 0 },
]

const STATUS_COLORS = {
  completed: 'bg-green-100 text-green-700',
  active: 'bg-blue-100 text-blue-700',
  handoff: 'bg-orange-100 text-orange-700',
  bot: 'bg-purple-100 text-purple-700',
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your WhatsApp assistant.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-full flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <div className={stat.bg + ' p-2 rounded-lg'}>
                <stat.icon className={cn('h-4 w-4', stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <span className={cn('text-sm font-medium', stat.trend === 'up' ? 'text-green-600' : 'text-red-600')}>
                  {stat.change} vs last week
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Conversations Chart */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Conversations This Week
              <span className="text-sm text-muted-foreground">Automated vs Handoff</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={conversationData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAutomated" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorHandoff" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickCount={4} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    labelStyle={{ color: '#f1f5f9' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="automated"
                    name="Automated"
                    stroke="#22c55e"
                    fillOpacity={1}
                    fill="url(#colorAutomated)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="handoff"
                    name="Handoff"
                    stroke="#f59e0b"
                    fillOpacity={1}
                    fill="url(#colorHandoff)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Lead Sources */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadSources}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {leadSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    formatter={(value: number) => [value, 'leads']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              {leadSources.map((source) => (
                <div key={source.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                  <span className="text-sm text-foreground">{source.name}</span>
                  <span className="text-sm font-medium text-foreground">{source.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hourly Activity & Recent Conversations */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Hourly Activity */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle>Hourly Message Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickCount={4} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    formatter={(value: number) => [value, 'messages']}
                  />
                  <Bar dataKey="messages" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarWidth={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Conversations */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Conversations</CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentConversations.map((conv) => (
                <div
                  key={conv.id}
                  className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground truncate">{conv.customer}</span>
                        <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full', STATUS_COLORS[conv.status as keyof typeof STATUS_COLORS])}>
                          {conv.status}
                        </span>
                        {conv.unread > 0 && (
                          <span className="w-5 h-5 bg-brand-600 text-white text-xs rounded-full flex items-center justify-center">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-1">{conv.lastMessage}</p>
                      <p className="text-xs text-muted-foreground">{conv.phone}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{conv.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'View All Conversations', href: '/dashboard/conversations', icon: MessageSquare },
              { label: 'Export Leads', href: '/dashboard/leads?export=true', icon: Users },
              { label: 'Update FAQ', href: '/dashboard/settings#faq', icon: CheckCircle },
              { label: 'View Analytics', href: '/dashboard/analytics', icon: TrendingUp },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-brand-500/50 hover:bg-brand-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center">
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="font-medium text-foreground">{action.label}</span>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}