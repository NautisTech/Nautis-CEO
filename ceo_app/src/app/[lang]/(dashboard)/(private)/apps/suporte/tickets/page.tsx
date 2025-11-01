import Grid from '@mui/material/Grid2'
import TicketsTable from '@/views/apps/suporte/TicketsTable'
import TicketsSupportTracker from '@/views/apps/suporte/widgets/TicketsSupportTracker'
import TicketsPriorityDistribution from '@/views/apps/suporte/widgets/TicketsPriorityDistribution'

const TicketsPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TicketsSupportTracker />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TicketsPriorityDistribution />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TicketsTable />
      </Grid>
    </Grid>
  )
}

export default TicketsPage
