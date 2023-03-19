import React from 'react'
import { useSelector } from 'react-redux';
import { selectLoading, selectToken, selectUserInfo } from '../features/auth/authSlice';

function useAuth() {
  const userToken = useSelector(selectToken);
  const userInfo = useSelector(selectUserInfo);
  const isLoading = useSelector(selectLoading);

  return [Boolean(userToken && userInfo), isLoading] as const
}

export default useAuth