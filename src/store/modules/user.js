import { resetRouter } from '@/router';
import { adminUserByToken } from '../../graphql/adminUserByToken.gql';
import { adminUserLogout } from '../../graphql/adminUserLogout.gql';

const getDefaultState = () => ({
  userInfo: {
    nickname: '',
    avatar: '',
  },
});

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo;
  },
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      if (userInfo) {
        commit('SET_USERINFO', userInfo);
        resolve(userInfo);
      } else {
        console.error('No user is found for input username and password');
        reject('Invalid username or password, please try again.');
      }
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      if (state.userInfo && state.userInfo.nickname && state.userInfo.avatar) resolve();

      try {
        const apolloClient = this.apolloProvider.defaultClient;
        // Update cache
        const response = await apolloClient.query({
          query: adminUserByToken,
        });
        const { data } = response;

        if (!data || data.adminUserByToken == null) {
          reject('Verification failed, please Login again.');
        }

        commit('SET_USERINFO', data.adminUserByToken);
        resolve(data.adminUserByToken);
      } catch (error) {
        reject(error);
      }
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      // must remove token first
      try {
        const apolloClient = this.apolloProvider.defaultClient;
        await apolloClient.mutate({
          mutation: adminUserLogout,
        });
        resolve();
      } catch (error) {
        reject(error);
      }

      resetRouter();
      commit('RESET_STATE');
      resolve();
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(async (resolve, reject) => {
      // must remove  token  first
      try {
        const apolloClient = this.apolloProvider.defaultClient;
        await apolloClient.mutate({
          mutation: adminUserLogout,
        });
        resolve();
      } catch (error) {
        reject(error);
      }
      commit('RESET_STATE');
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
