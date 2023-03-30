import { Button, Card, CardActions, CardContent, CardHeader, Container, Grid, Skeleton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';

export interface IProductTileProps {
}

export function ProductTile (props: IProductTileProps) {
  return (
    <React.Fragment>
        <Grid item key="Tier title" xs={12} sm={6} md={4} lg={3}>
            <Card>
            <CardHeader
                title="Tier title"
                subheader="Tier subheader"
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{
                align: 'center',
                }}
                
            />
            <CardContent>
                <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'baseline',
                    mb: 2,
                }}
                >
                <Typography component="h2" variant="h3" color="text.primary">
                    42 лв.
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    /mo
                </Typography>
                </Box>
                <ul>
                    <Typography component="li" variant="subtitle1" align="center" key="line" >line</Typography>
                    <Typography component="li" variant="subtitle1" align="center" key="line" >line</Typography>
                    <Typography component="li" variant="subtitle1" align="center" key="line" >line</Typography>
                    <Typography component="li" variant="subtitle1" align="center" key="line" >line</Typography>
                </ul>
            </CardContent>
            <CardActions>
                <Button
                fullWidth
                // variant={tier.buttonVariant as 'outlined' | 'contained'}
                variant='outlined'
                >
                Button Text
                </Button>
            </CardActions>
            </Card>
        </Grid>    
    </React.Fragment>
  );
}
