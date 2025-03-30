// const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

// Mock Supabase client
const supabase = {
  // Mock channel method
  channel: (channelName) => {
    console.log(`MOCK: Creating Supabase channel ${channelName}`);
    return {
      on: (event, config, callback) => {
        console.log(`MOCK: Setting up listener for ${event} on ${config.table}`);
        return {
          subscribe: () => {
            console.log(`MOCK: Subscribed to ${channelName}`);
            return {};
          }
        };
      }
    };
  },
  // Mock database operations
  from: (tableName) => {
    return {
      insert: (data) => {
        console.log(`MOCK: Would insert into ${tableName}:`, data);
        return { data, error: null };
      },
      select: (columns) => {
        console.log(`MOCK: Would select ${columns || '*'} from ${tableName}`);
        return { 
          data: [], 
          error: null 
        };
      }
    };
  }
};

module.exports = supabase; 