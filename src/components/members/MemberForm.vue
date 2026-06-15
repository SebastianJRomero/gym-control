<template>

  <form @submit.prevent="submitForm">

    <h2>
    {{
      props.member
        ? 'Editar Miembro'
        : 'Nuevo Miembro'
    }}
    </h2>

    <input
      v-model="form.nombre"
      placeholder="Nombre"
      required
    />

    <input
      v-model="form.cedula"
      placeholder="Cédula"
      required
    />

    <input
      v-model="form.celular"
      placeholder="Celular"
      required
    />

    <input
      v-model="form.numero_recibo"
      placeholder="Número de recibo"
      required
    />

    <label>
  Tipo de membresía
</label>

<select
  v-model="form.tipo_membresia"
  @change="updateMembershipDates"
  required
>

  <option value="">
    Seleccione
  </option>

  <option
    v-for="type in membershipTypes"
    :key="type.id"
    :value="type.nombre"
  >
    {{ type.nombre }}
  </option>

</select>
    <label>
      Fecha inicio
    </label>

    <input
      type="date"
      v-model="form.fecha_inicio"
      @change="updateMembershipDates"
      required
    />

    <label>
      Fecha fin
    </label>

    <input
      type="date"
      v-model="form.fecha_fin"
      required
    />

    <textarea
      v-model="form.observaciones"
      placeholder="Observaciones"
    />

    <button type="submit">

    {{
      props.member
        ? 'Guardar cambios'
        : 'Guardar'
     }}

    </button>

    
  </form>

</template>

<script setup>

import {
  reactive,
  ref,
  onMounted,
  watch
} from 'vue'

import {
  getMembershipTypes
} from '../../services/membershipTypeService'

const emit =
  defineEmits(['save'])

const props = defineProps({
  member: {
    type: Object,
    default: null
  }
})

const membershipTypes = ref([])

const form = reactive({

  nombre: '',
  cedula: '',
  celular: '',

  numero_recibo: '',
  fecha_inicio: '',
  fecha_fin: '',

  tipo_membresia: '',
  observaciones: '',

})

watch(
  () => props.member,
  (member) => {

    if (!member) {
      return
    }

    Object.assign(
      form,
      member
    )

  },
  {
    immediate: true
  }
)

function submitForm() {

  emit(
    'save',
    { ...form }
  )
}

async function loadMembershipTypes() {

  try {

    const result =
      await getMembershipTypes()

    membershipTypes.value =
      result.data

  } catch (error) {

    console.error(
      'Error cargando membresías',
      error
    )

  }

}

onMounted(() => {

  loadMembershipTypes()

})

function updateMembershipDates() {

  const selectedType =
    membershipTypes.value.find(
      type =>
        type.nombre ===
        form.tipo_membresia
    )

  if (!selectedType) {
    return
  }

  if (!form.fecha_inicio) {
    return
  }

  const startDate =
    new Date(form.fecha_inicio)

  const endDate =
    new Date(startDate)

  endDate.setDate(
    endDate.getDate() +
    selectedType.dias
  )

  form.fecha_fin =
    endDate
      .toISOString()
      .split('T')[0]
}

</script>