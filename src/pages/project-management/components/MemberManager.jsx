import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const MemberManager = ({ project, user }) => {
  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('viewer');

  const fetchMembersAndInvites = async () => {
    // Fetch members
    const { data: membersData, error: membersError } = await supabase.rpc('get_project_members', {
      p_id: project.id,
    });
    if (membersError) toast.error('Failed to fetch members.');
    else setMembers(membersData);

    // Fetch invitations
    const { data: invitesData, error: invitesError } = await supabase
      .from('invitations')
      .select('id, email, role, status')
      .eq('project_id', project.id);
    if (invitesError) toast.error('Failed to fetch invitations.');
    else setInvitations(invitesData);
  };

  useEffect(() => {
    if (project) {
      fetchMembersAndInvites();
    }
  }, [project]);

  const handleInviteMember = async () => {
    const email = newMemberEmail.trim().toLowerCase();
    if (email === '') return;

    const { error } = await supabase.from('invitations').insert({
      project_id: project.id,
      email: email,
      role: newMemberRole,
    });

    if (error) {
      toast.error(`Failed to send invitation: ${error.message}`);
    } else {
      toast.success('Invitation sent.');
      setNewMemberEmail('');
      fetchMembersAndInvites(); // Refresh invitations
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('project_id', project.id)
      .eq('user_id', userId);

    if (error) {
      toast.error('Failed to remove member.');
    } else {
      toast.success('Member removed.');
      fetchMembersAndInvites(); // Refresh members
    }
  };

  const handleCancelInvitation = async (invitationId) => {
    const { error } = await supabase
      .from('invitations')
      .delete()
      .eq('id', invitationId);
    
    if (error) {
      toast.error('Failed to cancel invitation.');
    } else {
      toast.success('Invitation cancelled.');
      fetchMembersAndInvites(); // Refresh invitations
    }
  };

  const canManage = project.project_members[0]?.role === 'admin';

  return (
    <div className="mt-4 p-4 border rounded-lg bg-card">
      <h3 className="font-semibold mb-2">Manage Members</h3>
      
      {canManage && (
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="user@example.com"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
          />
          <select
            value={newMemberRole}
            onChange={(e) => setNewMemberRole(e.target.value)}
            className="border rounded px-2 bg-background"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
          <Button onClick={handleInviteMember}>Invite</Button>
        </div>
      )}

      <div>
        <h4 className="font-semibold text-sm mb-2">Current Members</h4>
        <ul className="space-y-2">
          {members.map(member => (
            <li key={member.user_id} className="flex justify-between items-center">
              <span>{member.users.email} ({member.role})</span>
              {canManage && member.user_id !== project.owner_id && (
                <Button size="sm" variant="ghost" className="text-error" onClick={() => handleRemoveMember(member.user_id)}>
                  Remove
                </Button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h4 className="font-semibold text-sm mb-2">Pending Invitations</h4>
        <ul className="space-y-2">
          {invitations.filter(inv => inv.status === 'pending').map(invitation => (
            <li key={invitation.id} className="flex justify-between items-center">
              <span>{invitation.email} ({invitation.role})</span>
              {canManage && (
                <Button size="sm" variant="ghost" className="text-error" onClick={() => handleCancelInvitation(invitation.id)}>
                  Cancel
                </Button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MemberManager;