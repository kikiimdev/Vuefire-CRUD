<template>
  <v-app>
    <v-main class="base-bg">
      <v-container>
        <v-layout column>
          <v-layout id="section-button"
            class="my-4 pa-2 elevation-20 align-center"
          >
            <v-card-title v-text="`Tabel ${namaTabel}`" />
            <v-spacer />
            <v-btn id="tombol-print"
              class="mx-2"
              color="success"
              outlined
              @click="printData()"
            >
              <v-icon v-text="'mdi-printer'" left />
              <span v-text="'Print'" />
            </v-btn>
            <v-btn id="tombol-tambah"
              color="primary"
              outlined
              @click="dialogTambah = true"
            >
              <v-icon v-text="'mdi-plus'" left />
              <span v-text="'Tambah'" />
            </v-btn>
          </v-layout>
          <v-data-table
            :headers="kolomTabel"
            :items="dataTabel"
            class="elevation-20"
          >
            <template #item.aksi="{ item }">
              <v-layout class="justify-end">
                <v-btn id="tombol-edit"
                  class="mx-2"
                  color="info"
                  outlined
                  @click="editData(item)"
                >
                  <v-icon v-text="'mdi-pencil-outline'" left />
                  <span v-text="'Edit'" />
                </v-btn>
                <v-btn id="tombol-hapus"
                  color="error"
                  outlined
                  @click="pilihData(item)"
                >
                  <v-icon v-text="'mdi-delete-outline'" left />
                  <span v-text="'Hapus'" />
                </v-btn>
              </v-layout>
            </template>
          </v-data-table>
        </v-layout>
      </v-container>

      <v-bottom-sheet id="dialog-tambah"
        v-model="dialogTambah"
        width="400"
      >
        <v-card
          class="px-6 py-4 elevation-20"
        >
          <div id="form-input"
            v-for="form in formTabel"
            :key="form.value"
          >
            <v-combobox
              v-if="form.type === 'combobox'"
              :label="form.text"
              :items="form.options"
              v-model="dataTambah[form.value]"
            />
            <v-text-field
              v-else-if="form.type === 'number'"
              :type="form.type"
              :label="form.text"
              v-model.number="dataTambah[form.value]"
            />
            <v-text-field
              v-else
              :type="form.type"
              :label="form.text"
              v-model.trim="dataTambah[form.value]"
            />
          </div>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="grey"
              text
              @click="dialogTambah = false"
            >
              Batal
            </v-btn>
            <v-btn
              color="primary"
              outlined
              @click="tambahData()"
            >
              Simpan
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-bottom-sheet>
      
      <v-bottom-sheet id="dialog-edit"
        v-model="dialogEdit"
        width="400"
      >
        <v-card
          class="px-6 py-4 elevation-20"
        >
          <div id="form-input"
            v-for="form in formTabel"
            :key="form.value"
          >
            <v-combobox
              v-if="form.type === 'combobox'"
              :label="form.text"
              :items="form.options"
              v-model="dataEdit[form.value]"
            />
            <v-text-field
              v-else-if="form.type === 'number'"
              :type="form.type"
              :label="form.text"
              v-model.number="dataEdit[form.value]"
            />
            <v-text-field
              v-else
              :type="form.type"
              :label="form.text"
              v-model.trim="dataEdit[form.value]"
            />
          </div>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="grey"
              text
              @click="dialogEdit = false"
            >
              Batal
            </v-btn>
            <v-btn
              color="primary"
              outlined
              @click="updateData()"
            >
              Update
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-bottom-sheet>

      <v-bottom-sheet id="dialog-hapus"
        v-model="dialogHapus"
        width="400"
      >
        <v-card
          class="pb-4 elevation-20"
        >
          <v-card-title v-text="'Hapus data'" />
          <v-card-text>
            <v-sheet
              class="pa-2"
              color="error lighten-5"
            >
              <span v-if="dataEdit" v-html="`Yakin hapus data <b>${dataEdit.id}</b> ?`" />
            </v-sheet>
          </v-card-text>
          <v-card-actions class="px-6">
            <v-spacer />
            <v-btn
              color="grey"
              text
              @click="dialogHapus = false"
            >
              Batal
            </v-btn>
            <v-btn
              color="error"
              outlined
              @click="hapusData()"
            >
              Hapus
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-bottom-sheet>
      
    </v-main>
  </v-app>
</template>

<script>

import jspdf from 'jspdf'
import 'jspdf-autotable'
import { db } from './database'
const tabelRef = db.collection('tabel')

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    namaTabel: 'Data',
    kolomTabel: [
      { text: 'ID', value: 'id' },
      { text: 'Data', value: 'data' },
      { text: 'Tanggal', value: 'date', type: 'date' },
      { text: 'Waktu', value: 'time', type: 'time' },
      { text: 'Number', value: 'number', type: 'number' },
      { text: 'Combobox', value: 'combobox', type: 'combobox', options: ['Hallo', 'Aloha'] },
      { text: '', value: 'aksi' },
    ],
    dataTabel: [],
    dataTambah: {},
    dataEdit: {},
    dialogTambah: null,
    dialogEdit: null,
    dialogHapus: null,
  }),

  computed: {
    formTabel() {
      const form = [...this.kolomTabel]

      form.pop()
      form.shift()

      return form
    },
    kolomPrint() {
      const kolom = [...this.kolomTabel]
      const kolomPrint = []

      kolom.pop()

      kolom.map(v => {
        var obj = {}

        obj.header = v.text
        obj.dataKey = v.value

        kolomPrint.push(obj)
      })
      
      return kolomPrint
    }
  },

  firestore: {
    dataTabel: tabelRef
  },

  methods: {
    async tambahData() {
      const data = {...this.dataTambah}
      await tabelRef.add(data)
      this.dialogTambah = false
      this.dataTambah = {}
    },
    editData(data) {
      this.dataEdit = {...data}
      this.dataEdit.id = data.id
      this.dialogEdit = true
    },
    async updateData() {
      const data = {...this.dataEdit}
      const id = data.id
      delete data.id
      await tabelRef.doc(id).update(data)
      this.dialogEdit = false
      this.dataEdit = {}
    },
    pilihData(data) {
      this.dataEdit = data
      this.dialogHapus = true
    },
    async hapusData() {
      const id = this.dataEdit.id
      await tabelRef.doc(id).delete()
      this.dialogHapus = false
      this.dataEdit = {}
    },
    printData() {
      var doc = new jspdf()

      doc.text(`Laporan Tabel ${this.namaTabel}`, 14, 12)

      doc.autoTable({
        body: this.dataTabel,
        columns: this.kolomPrint
      })

      doc.save('Laporan.pdf')
    }
  }
};
</script>

<style lang="scss">
  $base-color: #F1F2F7;
  .base-bg {
    background-color: $base-color;
  }
</style>
