import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

/* ===========================
   UPDATE HIGH SCORE
=========================== */
export const updateHighScore = createAsyncThunk(
  "users/updateHighScore",
  async ({ game, score }, { getState, rejectWithValue }) => {
    try {
      const user = getState().users.currentUser;
      if (!user || !user._id) {
        return rejectWithValue("User not logged in");
      }

      const res = await api.post("/scores/update", {
        userId: user._id,
        game,
        score,
      });

      return res.data; // { game, highScore }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

/* ===========================
   INCREMENT TIC TAC TOE WIN
=========================== */
export const incrementTicTacToeWin = createAsyncThunk(
  "users/incrementTicTacToeWin",
  async (_, { getState, rejectWithValue }) => {
    try {
      const user = getState().users.currentUser;
      if (!user || !user._id) {
        return rejectWithValue("User not logged in");
      }

      const res = await api.post("/scores/increment", {
        userId: user._id,
        game: "ticTacToe",
      });

      return res.data; // { game, newValue }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

/* ===========================
   INITIAL STATE
=========================== */
const initialState = {
  currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
  loading: false,
  error: null,
};

/* ===========================
   SLICE
=========================== */
const usersSlice = createSlice({
  name: "users",
  initialState,

  reducers: {
    loginUser: (state, action) => {
      const user = action.payload;

      user.scores = user.scores || {
        snakeGame: 0,
        flappyBird: 0,
        ticTacToe: 0,
      };

      state.currentUser = user;
      state.error = null;

      localStorage.setItem("currentUser", JSON.stringify(user));
    },

    logoutUser: (state) => {
      state.currentUser = null;
      state.error = null;
      localStorage.removeItem("currentUser");
    },

    updateUser: (state, action) => {
      if (!state.currentUser) return;

  // Merge new fields into currentUser
      state.currentUser = { ...state.currentUser, ...action.payload };

      localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
    },


    updateAvatar: (state, action) => {
      if (!state.currentUser) return;

      state.currentUser.avatar = action.payload;
      localStorage.setItem(
        "currentUser",
        JSON.stringify(state.currentUser)
      );
    },
  },

  extraReducers: (builder) => {
    builder
      /* ===== HIGH SCORE ===== */
      .addCase(updateHighScore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateHighScore.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.currentUser || !action.payload) return;

        const { game, highScore } = action.payload;
        state.currentUser.scores[game] = highScore;

        localStorage.setItem(
          "currentUser",
          JSON.stringify(state.currentUser)
        );
      })

      .addCase(updateHighScore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Score update failed";
      })

      /* ===== TIC TAC TOE WIN COUNTER ===== */
      .addCase(incrementTicTacToeWin.fulfilled, (state, action) => {
        if (!state.currentUser || !action.payload) return;

        const { game, newValue } = action.payload;
        state.currentUser.scores[game] = newValue;

        localStorage.setItem(
          "currentUser",
          JSON.stringify(state.currentUser)
        );
      });
  },
});

export const {
  loginUser,
  logoutUser,
  updateUser,
  updateAvatar,
} = usersSlice.actions;

export default usersSlice.reducer;
