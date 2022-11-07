import React, { useEffect, useState } from 'react';
import { trpc } from '~/utils/trpc';
import { Skeleton, Stack } from '@mui/material';
import { ContestCategory } from '@prisma/client';
import ContestPickerCategoryCard from '~/components/ContestPickerCategory';
import { useQueryParams } from '~/hooks/useQueryParams';
import { updateAllBetsContestCategory } from '~/state/bets';
import { useAppDispatch } from '~/state/hooks';

const ContestPickerCategoryContainer: React.FC = () => {
  const { setParam, contestCategoryId } = useQueryParams();
  const [selectedCategory, setSelectedCategory] = useState<
    ContestCategory | undefined
  >();
  const dispatch = useAppDispatch();
  const { isLoading, data } = trpc.contest.contestCategoryList.useQuery();

  const handleChangeCategory = (category: ContestCategory) => {
    setParam('contestCategoryId', category.id);
    setSelectedCategory(category);
    dispatch(updateAllBetsContestCategory(category));
  };

  const handleClick = (category: ContestCategory) => {
    handleChangeCategory(category);
  };

  useEffect(() => {
    if (!data) return;
    const category =
      data.find((category) => category.id === contestCategoryId) || data[0];
    if (category) {
      handleChangeCategory(category);
    }
  }, [contestCategoryId, data]);

  if (isLoading) return <Skeleton />;

  if (!isLoading && !data)
    return <div> No available category for this contest</div>;

  return (
    <Stack direction={'row'} spacing={2} sx={{ mt: 1, mb: 1 }}>
      {data.map((category) => (
        <ContestPickerCategoryCard
          key={category.id}
          category={category}
          isSelected={category.id === selectedCategory?.id}
          handleClick={handleClick}
        />
      ))}
    </Stack>
  );
};

export default ContestPickerCategoryContainer;
