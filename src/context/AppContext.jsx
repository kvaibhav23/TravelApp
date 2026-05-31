import { createContext, useContext, useReducer } from 'react';
import {
  CURRENT_USER,
  GROUP_MEMBERS,
  DESTINATIONS,
  CHAT_MESSAGES,
  VOTES,
  TRIP_EXPENSES,
} from '../data/mockTravelData';

const AppContext = createContext(null);

const initialState = {
  // Auth & User
  currentUser: CURRENT_USER,
  isAuthenticated: false,
  kycStatus: 'not-started', // not-started | lite | full | verified
  userRole: null, // student | family | corporate

  // Group & Trip
  groupMembers: GROUP_MEMBERS,
  activeTrip: {
    id: 'trip-1',
    name: 'August Long Weekend 🏖️',
    status: 'planning', // planning | voting | booking | active | completed
    dates: 'Aug 14 – Aug 17, 2025',
    createdBy: 'u1',
  },

  // Chat
  messages: CHAT_MESSAGES,

  // Consensus
  destinations: DESTINATIONS,
  votes: VOTES,
  lockedItinerary: null,
  roomClaims: {},

  // Payments
  paymentMode: null, // split | single
  preAuths: {},
  paymentComplete: false,

  // On-Trip
  expenses: TRIP_EXPENSES,
  tripActive: false,

  // UI
  currentStep: 0, // onboarding step
  showCelebration: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: true };

    case 'SET_USER_ROLE':
      return { ...state, userRole: action.payload };

    case 'SET_KYC_STATUS':
      return { ...state, kycStatus: action.payload };

    case 'SET_ONBOARDING_STEP':
      return { ...state, currentStep: action.payload };

    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };

    case 'VOTE': {
      const { destinationId, vote, userId } = action.payload;
      const currentVotes = state.votes[destinationId] || { up: [], down: [] };

      // Remove existing vote
      const cleanUp = currentVotes.up.filter(id => id !== userId);
      const cleanDown = currentVotes.down.filter(id => id !== userId);

      // Add new vote
      if (vote === 'up') cleanUp.push(userId);
      else cleanDown.push(userId);

      return {
        ...state,
        votes: {
          ...state.votes,
          [destinationId]: { up: cleanUp, down: cleanDown }
        }
      };
    }

    case 'LOCK_ITINERARY':
      return {
        ...state,
        lockedItinerary: action.payload,
        activeTrip: { ...state.activeTrip, status: 'booking' }
      };

    case 'CLAIM_ROOM':
      return {
        ...state,
        roomClaims: { ...state.roomClaims, [action.payload.roomId]: action.payload.userId }
      };

    case 'SET_PAYMENT_MODE':
      return { ...state, paymentMode: action.payload };

    case 'SET_PRE_AUTH': {
      const { userId, status } = action.payload;
      return {
        ...state,
        preAuths: { ...state.preAuths, [userId]: status }
      };
    }

    case 'COMPLETE_PAYMENT':
      return {
        ...state,
        paymentComplete: true,
        activeTrip: { ...state.activeTrip, status: 'active' },
        tripActive: true
      };

    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };

    case 'SHOW_CELEBRATION':
      return { ...state, showCelebration: action.payload };

    case 'SET_TRIP_STATUS':
      return { ...state, activeTrip: { ...state.activeTrip, status: action.payload } };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

export default AppContext;
