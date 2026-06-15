<template>
  <table border="1">
    <thead>
      <tr>
        <th>#</th>
        <th>Nombre</th>
        <th>Cédula</th>
        <th>Celular</th>
        <th>Membresía</th>
        <th>Inicio</th>
        <th>Fin</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="member in members" :key="member.id">
        <td>{{ member.numero_recibo }}</td>
        <td>{{ member.nombre }}</td>
        <td>{{ member.cedula }}</td>
        <td>{{ member.celular }}</td>
        <td>
          {{ member.tipo_membresia || '-' }}
        </td>
        <td>
          {{ formatDate(member.fecha_inicio) }}
        </td>
        <td>
          {{ formatDate(member.fecha_fin) }}
        </td>
        <td>
          {{ getStatus(member.fecha_fin) }}
        </td>
        <td>
          <button @click="$emit('edit', member)">
            ✏️
          </button>
          <button @click="$emit('archive', member)">
            🚫
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

---------------------------------------------------------------------

<script setup>

defineProps({
  members: Array
})

defineEmits([
  'edit',
  'archive'
])

function getStatus(fechaFin) {

  const hoy = new Date()

  hoy.setHours(0, 0, 0, 0)

  const fin = new Date(fechaFin)

 return fin >= hoy
  ? 'Activa'              // Modificar despues con CSS para mostrar en verde
  : 'Vencida'             // .activa {color: green;} .vencida {color: red;}
}

function formatDate(dateString) {

  if (!dateString) return '-'

  const date = new Date(dateString)

  const months = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic'
  ]

  const day = date.getDate()

  const month =
    months[date.getMonth()]

  const year =
    date.getFullYear()

  return `${day} ${month} ${year}`
}

</script>