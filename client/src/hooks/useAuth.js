import { useSelector } from 'react-redux';

// Convenience hook — avoids repeating useSelector boilerplate across components
const useAuth = () => {
  const { user, loading, error } = useSelector((state) => state.auth);
  return { user, loading, error, isAuthenticated: !!user };
};

export default useAuth;