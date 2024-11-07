import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/lib/store'

export interface Document {
  id: string
  name: string
  type: string
  size: number
  url: string
  chatbotId?: string
  chatbotName?: string
  createdAt: string
  status: 'processed' | 'processing' | 'failed'
}

interface DocumentsState {
  documents: Document[]
  selectedDocument: Document | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: DocumentsState = {
  documents: [],
  selectedDocument: null,
  status: 'idle',
  error: null,
}

export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async () => {
    const response = await fetch('/api/documents')
    if (!response.ok) {
      throw new Error('Failed to fetch documents')
    }
    return response.json()
  }
)

export const deleteDocument = createAsyncThunk(
  'documents/deleteDocument',
  async (documentId: string) => {
    const response = await fetch(`/api/documents/${documentId}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete document')
    }
    return documentId
  }
)

export const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    selectDocument: (state, action: PayloadAction<Document>) => {
      state.selectedDocument = action.payload
    },
    clearSelectedDocument: (state) => {
      state.selectedDocument = null
    },
    clearError: (state) => {
      state.error = null
    },
    addDocument: (state, action: PayloadAction<Document>) => {
      state.documents.unshift(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.documents = action.payload
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch documents'
      })
      .addCase(deleteDocument.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.documents = state.documents.filter(doc => doc.id !== action.payload)
        if (state.selectedDocument?.id === action.payload) {
          state.selectedDocument = null
        }
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to delete document'
      })
  },
})

export const { 
  selectDocument, 
  clearSelectedDocument, 
  clearError,
  addDocument 
} = documentsSlice.actions

export const selectAllDocuments = (state: RootState) => state.documents.documents
export const selectDocumentById = (state: RootState, documentId: string) =>
  state.documents.documents.find(doc => doc.id === documentId)
export const selectDocumentsStatus = (state: RootState) => state.documents.status
export const selectDocumentsError = (state: RootState) => state.documents.error
export const selectSelectedDocument = (state: RootState) => state.documents.selectedDocument

export default documentsSlice.reducer 