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

export async function getMembers() {

  const response =
    await api.get(
      '/members',
      getAuthConfig()
    )

  return response.data
}

export async function createMember(data) {

  const response =
    await api.post(
      '/members',
      data,
      getAuthConfig()
    )

  return response.data
}

export async function archiveMember(id) {

  const response =
    await api.put(
      `/members/${id}/archive`,
      {},
      getAuthConfig()
    )

  return response.data
}

export async function deleteMember(id) {

  const response =
    await api.delete(
      `/members/${id}`,
      getAuthConfig()
    )

  return response.data
}

export async function updateMember(
  id,
  data
) {

  const response =
    await api.put(
      `/members/${id}`,
      data,
      getAuthConfig()
    )

  return response.data
}