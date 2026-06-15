<template>
  <div>
    <h1>Miembros</h1>
    <button @click="openCreateModal">
      Nuevo Registro
    </button>
    <input
      v-model="search"
      placeholder="Buscar recibo, nombre, cédula o celular"
      style="
        margin-left: 10px;
        padding: 8px;
        width: 300px;
      "
    />
    <div
      style="
        margin: 15px 0;
        display: flex;
        gap: 20px;
      "
    >
      <strong>Miembros: {{ members.length }}</strong>
      <strong>Activos: {{ activeMembers }}</strong>
      <strong>Vencidos: {{ expiredMembers }}</strong>
    </div>
    <MembersTable
      :members="filteredMembers"
        @edit="handleEditMember"
        @archive="handleArchiveMember"
    />
    <MemberModal
      :show="showModal"
      @close="closeModal"
    >
      <MemberForm
        :member="selectedMember"
        @save="handleCreateMember"
      />
    </MemberModal>
  </div>
</template>

-------------------------------------------

<script setup>

import {
  ref,
  onMounted,
  computed
} from 'vue'

onMounted(() => {loadMembers()})                      

import MemberModal
from '../components/members/MemberModal.vue'

import MemberForm
from '../components/members/MemberForm.vue'

import {
  createMember,
  updateMember,
  getMembers
}
from '../services/memberService'

import MembersTable
from '../components/members/MembersTable.vue'

import { archiveMember } 
from '../services/memberService'

async function handleCreateMember(data) {

  try {

    if (selectedMember.value) {

      await updateMember(
        selectedMember.value.id,
        data
      )

      alert(
        'Miembro actualizado'
      )

    } else {

      await createMember(data)

      alert(
        'Miembro creado'
      )

    }

    showModal.value = false

    selectedMember.value = null

    await loadMembers()

  } catch (error) {

    console.error(error)

    const message =
      error.response?.data?.message
      || 'Error guardando miembro'

    alert(message)

  }

}

const showModal = ref(false)

const selectedMember = ref(null)

const members = ref([])

const search = ref('')

async function loadMembers() {

  const result =
    await getMembers()

  members.value =
    result.data
}

const filteredMembers = computed(() => {

  if (!search.value) {
    return members.value
  }

  const query =
    search.value.toLowerCase()

  return members.value.filter(member => {

    return (

      member.nombre
        ?.toLowerCase()
        .includes(query)

      ||

      member.cedula
        ?.toLowerCase()
        .includes(query)

      ||

      member.celular
        ?.toLowerCase()
        .includes(query)

        ||

      member.numero_recibo
        ?.toLowerCase()
        .includes(query)

    )

  })

})

const activeMembers = computed(() => {

  const today = new Date()

  today.setHours(0, 0, 0, 0)

  return members.value.filter(member => {

    const endDate =
      new Date(member.fecha_fin)

    return endDate >= today

  }).length

})

const expiredMembers = computed(() => {

  const today = new Date()

  today.setHours(0, 0, 0, 0)

  return members.value.filter(member => {

    const endDate =
      new Date(member.fecha_fin)

    return endDate < today

  }).length

})

async function handleArchiveMember(member) {

  const confirmed =
    confirm(
      `¿Archivar a ${member.nombre}?`
    )

  if (!confirmed) {
    return
  }

  try {

    await archiveMember(member.id)

    await loadMembers()

    alert(
      'Miembro archivado'
    )

  } catch (error) {

    console.error(error)

    alert(
      'Error archivando miembro'
    )

  }

}

function handleEditMember(member) {

  selectedMember.value =
    member

  showModal.value = true

}

function openCreateModal() {

  selectedMember.value = null

  showModal.value = true

}

function closeModal() {

  showModal.value = false

  selectedMember.value = null

}

</script>