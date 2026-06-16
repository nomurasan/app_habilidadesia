import React from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { Company } from '../types';

interface AdminSectionViewProps {
  user: any;
  userProfile: any;
  allUsers: any[];
  availableCompanies: Company[];
  companyUsers: any[];
  currentCompany: Company | null;
  whitelist: any[];
  newWhitelistedEmail: string;
  setNewWhitelistedEmail: (val: string) => void;
  handleAddWhitelist: () => Promise<void>;
  handleRemoveWhitelist: (id: string) => Promise<void>;
  handleToggleUserAdmin: (userId: string, currentVal: boolean) => Promise<void>;
  handleDeleteUser: (userId: string) => Promise<void>;
  handleJoinCompany: (companyId: string) => Promise<void>;
  handleCreateCompany: () => Promise<void>;
  handleUpdateCompany: () => Promise<void>;
  handleDeleteCompany: (companyId: string) => Promise<void>;
  isCreatingNewCompany: boolean;
  setIsCreatingNewCompany: (val: boolean) => void;
  editingCompany: Company | null;
  setEditingCompany: (company: Company | null) => void;
  isRegisteringCompany: boolean;
  newCompanyName: string;
  setNewCompanyName: (val: string) => void;
  getRank: (xp: number) => { name: string; color: string };
  isWhitelistingLoading: boolean;
}

export const AdminSectionView: React.FC<AdminSectionViewProps> = ({
  user,
  userProfile,
  allUsers,
  availableCompanies,
  companyUsers,
  currentCompany,
  whitelist,
  newWhitelistedEmail,
  setNewWhitelistedEmail,
  handleAddWhitelist,
  handleRemoveWhitelist,
  handleToggleUserAdmin,
  handleDeleteUser,
  handleJoinCompany,
  handleCreateCompany,
  handleUpdateCompany,
  handleDeleteCompany,
  isCreatingNewCompany,
  setIsCreatingNewCompany,
  editingCompany,
  setEditingCompany,
  isRegisteringCompany,
  newCompanyName,
  setNewCompanyName,
  getRank,
  isWhitelistingLoading,
}) => {
  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-12 font-sans select-none">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zello-orange/10 border border-zello-orange/20 text-zello-orange text-[10px] font-black uppercase tracking-widest font-mono">
            <LucideIcons.ShieldAlert size={12} className="animate-pulse" />
            Painel Administrativo Jedi
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none font-sans">
            CONTROLE DE <span className="text-zello-orange">ACESSO CORPORATIVO</span>
          </h2>
          <p className="text-slate-400 font-medium">
            Gerencie e autorize colaboradores, crie turmas e acompanhe a evolução de XP.
          </p>
        </div>
      </div>

      {isCreatingNewCompany || editingCompany ? (
        <div
          key="edit-company-form-block"
          className="p-8 md:p-12 bg-white/5 border border-white/10 rounded-[40px] space-y-8 max-w-2xl mx-auto relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zello-orange to-transparent"></div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">
              {editingCompany ? 'Editar Nome da Turma' : 'Registrar Nova Turma'}
            </h3>
            <p className="text-sm text-slate-500 font-medium font-sans">
              Insira o nome para identificar esta empresa/turma na plataforma de jornada de IA.
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Ex: Departamento de Marketing Corp"
              value={editingCompany ? editingCompany.name : newCompanyName}
              onChange={(e) => {
                if (editingCompany) {
                  setEditingCompany({ ...editingCompany, name: e.target.value });
                } else {
                  setNewCompanyName(e.target.value);
                }
              }}
              className="w-full bg-slate-900 border-2 border-white/10 focus:border-zello-orange rounded-2xl p-5 text-white font-bold text-base outline-none transition-all placeholder:text-slate-600"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={editingCompany ? handleUpdateCompany : handleCreateCompany}
              disabled={
                isRegisteringCompany ||
                (editingCompany ? !editingCompany.name.trim() : !newCompanyName.trim())
              }
              className="flex-1 py-5 bg-zello-orange text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:brightness-110 shadow-[0_0_30px_rgba(240,90,40,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isRegisteringCompany ? (
                <LucideIcons.Loader2 className="animate-spin" size={20} />
              ) : editingCompany ? (
                'Salvar Alterações'
              ) : (
                'Concluir Cadastro'
              )}
            </button>
            <button
              onClick={() => {
                setIsCreatingNewCompany(false);
                setEditingCompany(null);
              }}
              className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-white/10 transition-all cursor-pointer"
            >
              Voltar
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 p-6 rounded-[32px] border border-white/10 select-none">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                Empresas &amp; Turmas
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Selecione sua organização para iniciar a jornada.
              </p>
            </div>
            <button
              onClick={() => setIsCreatingNewCompany(true)}
              className="px-8 py-4 bg-zello-orange text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:brightness-110 shadow-[0_0_20px_rgba(240,90,40,0.3)] transition-all flex items-center gap-3 cursor-pointer"
            >
              <LucideIcons.PlusCircle size={20} />
              Registrar Empresa
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 select-none">
            {availableCompanies.length > 0 ? (
              availableCompanies.map((comp, idx) => (
                <div
                  key={`company-listing-card-v6-${comp.id}-${idx}`}
                  className="group relative p-8 bg-white/5 border border-white/10 hover:border-zello-orange/50 rounded-[40px] transition-all duration-500 overflow-hidden flex flex-col justify-between min-h-[280px]"
                >
                  <div className="relative z-10 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-zello-orange/30 group-hover:bg-zello-orange/10 transition-all">
                        <LucideIcons.Building size={28} className="text-zello-orange" />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingCompany(comp)}
                          className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-slate-500 hover:text-white transition-all cursor-pointer"
                          title="Editar"
                        >
                          <LucideIcons.Settings size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Deseja realmente remover esta empresa/turma?')) {
                              handleDeleteCompany(comp.id);
                            }
                          }}
                          className="p-3 bg-white/5 rounded-xl hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all cursor-pointer"
                          title="Excluir"
                        >
                          <LucideIcons.Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-left">
                      <h3 className="text-2xl font-black text-white italic uppercase tracking-tight group-hover:text-zello-orange transition-colors">
                        {comp.name}
                      </h3>
                      <div className="flex items-center gap-3">
                        <code className="text-[10px] bg-zello-orange/10 px-3 py-1 rounded-full text-zello-orange font-bold font-mono tracking-widest select-all">
                          {comp.id}
                        </code>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinCompany(comp.id);
                    }}
                    className="relative z-10 w-full mt-8 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl group-hover:bg-zello-orange group-hover:border-zello-orange transition-all flex items-center justify-center gap-3 cursor-pointer"
                  >
                    Selecionar esta Turma
                    <LucideIcons.ChevronRight size={14} />
                  </button>

                  <LucideIcons.Building
                    className="absolute -bottom-4 -right-4 text-white opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none"
                    size={200}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full py-24 text-center space-y-6 bg-white/5 border border-white/10 rounded-[40px] border-dashed select-none">
                <LucideIcons.Building2 size={64} className="text-slate-800 mx-auto" />
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-slate-600 uppercase tracking-tight">
                    Nenhuma turma registrada
                  </h4>
                  <p className="text-slate-500 max-w-xs mx-auto text-sm">
                    Seja o pioneiro e comece a jornada de IA na sua organização.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreatingNewCompany(true)}
                  className="px-8 py-4 bg-zello-orange/10 border border-zello-orange/30 text-zello-orange text-xs font-black uppercase tracking-widest rounded-xl hover:bg-zello-orange hover:text-white transition-all cursor-pointer"
                >
                  Registrar Primeiro Grupo
                </button>
              </div>
            )}
          </div>

          {/* Global User List Section */}
          <div className="pt-16 pb-12 space-y-10 border-t border-white/5 select-none">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                  <LucideIcons.Users size={12} />
                  Diretório Global
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
                  TODOS OS <span className="text-zello-orange">PARTICIPANTES</span>
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Lista de todos os usuários que acessaram a plataforma e seus níveis de acesso.
                </p>
              </div>

              <div className="flex gap-4">
                <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center min-w-[140px]">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
                    TOTAL DE USUÁRIOS
                  </span>
                  <div className="text-2xl font-black text-white tabular-nums italic">
                    {allUsers.length}
                  </div>
                </div>
                <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center min-w-[140px]">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
                    ADMINS
                  </span>
                  <div className="text-2xl font-black text-zello-orange tabular-nums italic">
                    {allUsers.filter((u) => u.isAdmin).length}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-md">
              <div className="overflow-x-auto overflow-y-auto max-h-[600px] custom-scrollbar">
                <table className="w-full text-left">
                  <thead className="bg-white/10 sticky top-0 z-20 backdrop-blur-md">
                    <tr key="global-users-header-row-st">
                      <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Participante
                      </th>
                      <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                        XP Acumulado
                      </th>
                      <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                        Rank
                      </th>
                      <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                        Empresa / Turma
                      </th>
                      <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                        Atributo
                      </th>
                      <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {allUsers.map((u, idx) => (
                      <tr
                        key={`global-list-usr-row-v6-${u.userId || 'u'}-${idx}`}
                        className="hover:bg-white/5 transition-colors group/row"
                      >
                        <td className="p-8 text-left">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-zello-orange/10 flex items-center justify-center text-zello-orange font-black text-lg shadow-inner select-none">
                              {u.email?.[0].toUpperCase() || '?'}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-base font-bold text-white group-hover/row:text-zello-orange transition-colors select-text">
                                {u.email}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono tracking-wider opacity-60 select-all">
                                ID: {u.userId}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-8 text-center select-none">
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zello-orange/10 rounded-xl text-zello-orange text-sm font-black tabular-nums italic">
                            {u.xp || 0} XP
                          </div>
                        </td>
                        <td className="p-8 text-center select-none">
                          <div className={`text-xs font-black uppercase italic ${getRank(u.xp || 0).color}`}>
                            {getRank(u.xp || 0).name}
                          </div>
                        </td>
                        <td className="p-8 text-center select-none">
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {availableCompanies.find((c) => c.id === u.companyId)?.name || (
                              <span className="text-slate-600 italic">Sem Turma</span>
                            )}
                          </div>
                        </td>
                        <td className="p-8 text-center select-none">
                          <button
                            onClick={() => handleToggleUserAdmin(u.userId, !!u.isAdmin)}
                            disabled={u.userId === user?.uid}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:cursor-not-allowed ${
                              u.isAdmin
                                ? 'bg-zello-orange text-white shadow-[0_0_15px_rgba(240,90,40,0.4)]'
                                : 'bg-white/5 text-slate-500 border border-white/10 hover:bg-white/10'
                            }`}
                          >
                            {u.isAdmin ? 'ADMINISTRADOR' : 'PARTICIPANTE'}
                          </button>
                        </td>
                        <td className="p-8 text-right select-none">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => handleToggleUserAdmin(u.userId, !!u.isAdmin)}
                              disabled={u.userId === user?.uid}
                              className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 text-slate-400 hover:text-white transition-all disabled:opacity-20 cursor-pointer"
                              title={u.isAdmin ? 'Demitir Admin' : 'Tornar Admin'}
                            >
                              <LucideIcons.Shield size={18} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Tem certeza que deseja excluir as informações deste usuário?')) {
                                  handleDeleteUser(u.userId);
                                }
                              }}
                              disabled={u.userId === user?.uid}
                              className="p-3 bg-white/5 rounded-2xl hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all disabled:opacity-20 cursor-pointer"
                              title="Excluir Usuário"
                            >
                              <LucideIcons.UserMinus size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {allUsers.length === 0 && (
                      <tr key="global-users-empty-placeholder-v5">
                        <td colSpan={6} className="p-32 text-center select-none">
                          <div className="space-y-4">
                            <LucideIcons.UserSearch size={64} className="text-slate-800 mx-auto" strokeWidth={1.5} />
                            <p className="text-slate-500 font-bold italic uppercase tracking-widest">
                              Nenhum usuário cadastrado no sistema
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Whitelisted emails table segment */}
          <div
            key={`admin-management-panel-final-${userProfile?.companyId}`}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-12 border-t border-white/5 select-none"
          >
            {/* Left Col: Permissions whitelister */}
            <div className="lg:col-span-1 space-y-8 text-left">
              <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                  <LucideIcons.UserPlus size={120} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tight">
                    Autorizar Acesso
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">
                    Adicione e-mails à lista de permissão de acesso da plataforma.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={newWhitelistedEmail}
                      onChange={(e) => setNewWhitelistedEmail(e.target.value)}
                      placeholder="colaborador@empresa.com"
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-600 focus:border-zello-orange/50 outline-none transition-all font-semibold"
                    />
                  </div>
                  <button
                    disabled={isWhitelistingLoading || !newWhitelistedEmail.trim()}
                    onClick={handleAddWhitelist}
                    className="w-full py-4 bg-zello-orange text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:brightness-110 shadow-[0_0_20px_rgba(240,90,40,0.25)] transition-all flex items-center justify-center gap-3 disabled:opacity-40 cursor-pointer font-sans"
                  >
                    {isWhitelistingLoading ? (
                      <LucideIcons.Loader2 className="animate-spin" size={16} />
                    ) : (
                      <LucideIcons.UserPlus size={16} />
                    )}
                    Adicionar aos Permitidos
                  </button>
                </div>
              </div>
            </div>

            {/* Right Col: Whitelist list display */}
            <div className="lg:col-span-2 text-left">
              <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] space-y-6 min-h-[300px]">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tight">
                      Membros Autorizados
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Estes e-mails estão autorizados a realizar Onboarding.
                    </p>
                  </div>
                  <span className="px-3.5 py-1 bg-zello-orange/10 border border-zello-orange/20 text-zello-orange text-[10px] font-black rounded-lg">
                    {whitelist.length} AUTORIZADOS
                  </span>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {whitelist.map((item, idx) => (
                    <div
                      key={`whitelist-v3-${item.id || 'wh'}-${idx}`}
                      className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 hover:bg-white/[0.04] transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zello-orange/15 text-zello-orange flex items-center justify-center select-none text-sm font-black">
                          @
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-sm font-bold text-white select-text">
                            {item.email}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveWhitelist(item.id)}
                        className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                        title="Remover Autorização"
                      >
                        <LucideIcons.Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {whitelist.length === 0 && (
                    <div className="py-20 text-center space-y-4">
                      <LucideIcons.Fingerprint size={48} className="text-slate-800 mx-auto" strokeWidth={1.5} />
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                        Nenhuma credencial whitelist configurada
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
