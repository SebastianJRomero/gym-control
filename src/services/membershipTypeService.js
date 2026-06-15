import api from './api'

function getAuthConfig() {

  const token =
    localStorage.getItem('token')

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

}

export async function getMembershipTypes() {

  const response =
    await api.get(
      '/membership-types',
      getAuthConfig()
    )

  return response.data
}