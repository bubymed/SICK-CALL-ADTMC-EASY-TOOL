/* Medic access control — who can open the medic app.
   Control de acceso — quién puede abrir la app del médico.
   ROOT_PUBS: public keys of the root approver(s) (P-256, raw, base64url). The private key never lives in this repo.
   REVOKED:  ids of approver certificates or medic approvals that must stop working.
   ENFORCE_FROM: before this date, unapproved users can still "continue for now" (transition). */
const ACCESS={
  ROOT_PUBS:['BIRvnHR6jaQmlpYcuOuTUtRVHUNK4g-f4hg_8cSCBV1udBrAJzo49VQzAbg1xX6ng5cJCdau21j7-3KwKqoqN5w'],
  REVOKED:[],
  ENFORCE_FROM:'2026-10-23'
};
