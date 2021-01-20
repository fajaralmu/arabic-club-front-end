
export const mapCommonUserStateToProps = (state) => {
    return {
        applicationProfile: state.userState.applicationProfile,
        loggedUser: state.userState.loggedUser,
        loginStatus: state.userState.loginStatus,
        requestId: state.userState.requestId,
        cart: state.shopState.cart
    }
}