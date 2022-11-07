import { NextPageWithLayout } from '../_app';
import CartContainer from '~/containers/CartContainer/CartContainer';
import ContestPickerContainer from '~/containers/ContestContainer/ContestPickerContainer';
import MatchPickerTableContainer from '~/containers/MatchPickerTableContainer/MatchPickerTableContainer';
import LayoutContainer from '~/containers/LayoutContainer/LayoutContainer';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import ContestPickerCategoryContainer from '~/containers/ContestPickerCategoryContainer/ContestPickerCategoryContainer';
import { Grid } from '@mui/material';

const IndexPage: NextPageWithLayout = () => {
  return (
    <LayoutContainer>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={4}
        sx={(theme) => ({
          [theme.breakpoints.down('md')]: {
            p: 4,
          },
        })}
      >
        <Grid
          item
          sx={{
            zIndex: 10,
            minWidth: '305px',
            display: { md: 'block', xs: 'none' },
          }}
          md={4}
          lg={3}
        >
          <CartContainer />
        </Grid>
        <Grid
          item
          sx={(theme) => ({
            [theme.breakpoints.up('md')]: {
              p: 4,
              zIndex: 1,
            },
          })}
          xs={12}
          md={8}
          lg={9}
        >
          <ContestPickerContainer />
          <ContestPickerCategoryContainer />
          <MatchPickerTableContainer />
        </Grid>
      </Grid>
    </LayoutContainer>
  );
};

export default IndexPage;

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
});
