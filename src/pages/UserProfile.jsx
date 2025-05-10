import React from 'react';
import { UserCircle, Edit3, Award, Package, BarChart2, Mail, Calendar, Users, Brain, Zap } from 'lucide-react';

const UserProfile = () => {
  const user = {
    name: "Memora Enthusiast",
    username: "memoraFan_01",
    avatarUrl: "https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Placeholder image
    bio: "Exploring the frontiers of AI-driven memory and digital consciousness. Collector of rare knowledge packs and architect of innovative Fused Agents.",
    joinedDate: "March 15, 2023",
    email: "enthusiast@memora.io",
    memoriesCollected: 42,
    fusedAgentsCreated: 12, // Added a value and comma
    knowledgePacksOwned: 30,
    fusionSuccessRate: "95%",
    lastActive: "Today",
    achievements: [
      { id: 1, name: "Pioneer Fuser", icon: Zap, description: "Created first Fused Agent." },
      { id: 2, name: "Knowledge Curator", icon: Brain, description: "Collected 25+ Knowledge Packs." },
      { id: 3, name: "Community Contributor", icon: Users, description: "Shared a Fused Agent with others." },
    ],
    recentActivity: [
      { id: 1, action: "Fused 'Dream Weaver' Agent", time: "2 hours ago", type: "fusion" },
      { id: 2, action: "Acquired 'Ancient Philosophies' Pack", time: "5 hours ago", type: "acquisition" },
      { id: 3, action: "Updated 'Sci-Fi World Builder' Agent", time: "1 day ago", type: "update" },
    ]
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-navy-light p-6 rounded-lg shadow-md flex items-center">
      <Icon size={32} className={`mr-4 ${color || 'text-accent-purple'}`} />
      <div>
        <p className="text-sm text-gray-medium">{label}</p>
        <p className="text-2xl font-semibold text-white">{value}</p>
      </div>
    </div>
  );

  const AchievementItem = ({ icon: Icon, name, description }) => (
    <li className="flex items-start p-3 bg-navy-dark rounded-md hover:bg-gray-dark transition-colors">
      <Icon size={24} className="text-yellow-400 mr-3 mt-1 flex-shrink-0" />
      <div>
        <h4 className="font-semibold text-gray-light">{name}</h4>
        <p className="text-sm text-gray-medium">{description}</p>
      </div>
    </li>
  );

  const ActivityItem = ({ action, time, type }) => {
    let icon;
    let color;
    switch (type) {
      case 'fusion': icon = <Zap size={18} />; color = 'text-green-positive'; break;
      case 'acquisition': icon = <Package size={18} />; color = 'text-accent-blue'; break;
      case 'update': icon = <Edit3 size={18} />; color = 'text-yellow-400'; break;
      default: icon = <BarChart2 size={18} />; color = 'text-gray-medium';
    }
    return (
      <li className="flex items-center justify-between py-3 border-b border-gray-dark last:border-b-0">
        <div className="flex items-center">
          <span className={`mr-3 ${color}`}>{icon}</span>
          <p className="text-gray-light">{action}</p>
        </div>
        <p className="text-sm text-gray-medium">{time}</p>
      </li>
    );
  };


  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <div className="flex items-center mb-2">
            <UserCircle size={36} className="mr-3 text-accent-purple" />
            <h1 className="text-3xl font-bold text-white">User Profile</h1>
          </div>
          <p className="text-gray-medium">Manage your Memora identity and track your contributions.</p>
        </div>
        <button className="mt-4 sm:mt-0 bg-accent-blue hover:bg-opacity-80 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors">
          <Edit3 size={18} className="mr-2" /> Edit Profile
        </button>
      </header>

      {/* Profile Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 bg-navy-medium p-6 rounded-xl shadow-xl text-center glassmorphism">
          <img 
            src={user.avatarUrl} 
            alt={user.name} 
            className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-accent-purple object-cover"
          />
          <h2 className="text-2xl font-bold text-white">{user.name}</h2>
          <p className="text-accent-purple mb-1">@{user.username}</p>
          <p className="text-sm text-gray-medium px-4 line-clamp-3">{user.bio}</p>
          
          <div className="mt-4 pt-4 border-t border-gray-dark text-sm text-left space-y-2">
            <div className="flex items-center text-gray-light">
              <Mail size={16} className="mr-2 text-gray-medium" /> {user.email}
            </div>
            <div className="flex items-center text-gray-light">
              <Calendar size={16} className="mr-2 text-gray-medium" /> Joined: {user.joinedDate}
            </div>
             <div className="flex items-center text-gray-light">
              <BarChart2 size={16} className="mr-2 text-gray-medium" /> Last Active: {user.lastActive}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard icon={Package} label="Memories Collected" value={user.memoriesCollected} color="text-accent-blue" />
            <StatCard icon={Layers} label="Fused Agents Created" value={user.fusedAgentsCreated} color="text-green-positive" />
            <StatCard icon={Brain} label="Knowledge Packs Owned" value={user.knowledgePacksOwned} color="text-sky-400" />
            <StatCard icon={Zap} label="Fusion Success Rate" value={user.fusionSuccessRate} color="text-yellow-400" />
          </div>
          
          {/* Achievements Section */}
          <div className="bg-navy-medium p-6 rounded-xl shadow-xl glassmorphism">
            <div className="flex items-center mb-4">
              <Award size={24} className="mr-2 text-yellow-400" />
              <h3 className="text-xl font-semibold text-white">Achievements</h3>
            </div>
            {user.achievements.length > 0 ? (
              <ul className="space-y-3">
                {user.achievements.map(ach => <AchievementItem key={ach.id} {...ach} />)}
              </ul>
            ) : (
              <p className="text-gray-medium italic">No achievements unlocked yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-navy-medium p-6 rounded-xl shadow-xl glassmorphism">
        <div className="flex items-center mb-4">
          <BarChart2 size={24} className="mr-2 text-accent-blue" />
          <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
        </div>
        {user.recentActivity.length > 0 ? (
          <ul className="space-y-1">
            {user.recentActivity.map(act => <ActivityItem key={act.id} {...act} />)}
          </ul>
        ) : (
          <p className="text-gray-medium italic">No recent activity to display.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
