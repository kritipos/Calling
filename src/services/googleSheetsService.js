// src/services/googleSheetsService.js
import config from '../config';

class GoogleSheetsService {
  constructor() {
    this.baseUrl = config.googleScriptUrl;
    this.userId = config.currentUser.id;
    this.userName = config.currentUser.name;
  }

  // JSONP for GET requests
  jsonp(url) {
    return new Promise((resolve, reject) => {
      const callbackName = `jsonp_callback_${Date.now()}`;
      const script = document.createElement('script');
      
      // Define callback function
      window[callbackName] = (data) => {
        // Clean up
        delete window[callbackName];
        document.body.removeChild(script);
        clearTimeout(timeout);
        
        if (data) {
          resolve(data);
        } else {
          reject(new Error('No data received'));
        }
      };

      // Handle errors
      script.onerror = (error) => {
        delete window[callbackName];
        document.body.removeChild(script);
        clearTimeout(timeout);
        reject(error);
      };

      // Timeout after 10 seconds
      const timeout = setTimeout(() => {
        delete window[callbackName];
        document.body.removeChild(script);
        reject(new Error('JSONP request timeout'));
      }, 10000);

      // Construct URL with callback parameter
      const separator = this.baseUrl.includes('?') ? '&' : '?';
      script.src = `${this.baseUrl}${separator}callback=${callbackName}&t=${Date.now()}`;
      script.async = true;
      
      // Add script to document
      document.body.appendChild(script);
    });
  }

  // Hidden iframe for POST requests
  postViaIframe(action, data) {
    return new Promise((resolve, reject) => {
      // Create unique IDs
      const iframeId = `iframe_${Date.now()}`;
      const formId = `form_${Date.now()}`;
      
      // Create iframe
      const iframe = document.createElement('iframe');
      iframe.id = iframeId;
      iframe.name = iframeId;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      // Create form
      const form = document.createElement('form');
      form.id = formId;
      form.method = 'POST';
      form.action = this.baseUrl;
      form.target = iframeId;
      form.style.display = 'none';

      // Add action and data as hidden fields
      const addField = (name, value) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      };

      // Add all data fields
      addField('action', action);
      Object.keys(data).forEach(key => {
        addField(key, data[key]);
      });
      addField('userId', this.userId);

      // Handle iframe load
      iframe.onload = () => {
        try {
          // Try to get response from iframe
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          const responseText = iframeDoc.body.textContent || iframeDoc.body.innerText;
          
          let response;
          try {
            response = JSON.parse(responseText);
          } catch (e) {
            response = { success: true, data: responseText };
          }

          // Clean up
          setTimeout(() => {
            document.body.removeChild(iframe);
            document.body.removeChild(form);
          }, 100);

          resolve(response);
        } catch (error) {
          // If can't read response, assume success
          setTimeout(() => {
            document.body.removeChild(iframe);
            document.body.removeChild(form);
          }, 100);
          
          resolve({ success: true });
        }
      };

      // Handle iframe error
      iframe.onerror = (error) => {
        document.body.removeChild(iframe);
        document.body.removeChild(form);
        reject(error);
      };

      // Add form to document and submit
      document.body.appendChild(form);
      form.submit();
    });
  }

  // Get all leads using JSONP
  async getAllocatedLeads() {
    try {
      console.log('Fetching leads via JSONP...');
      const response = await this.jsonp(this.baseUrl);
      console.log('Leads response:', response);
      
      if (response && response.success) {
        return response.data || [];
      }
      
      console.warn('Unexpected response format:', response);
      return [];
    } catch (error) {
      console.error('Get leads error:', error);
      // Return empty array on error to prevent app crash
      return [];
    }
  }

  // Update remark using iframe POST
  async updateRemark(rowId, remark) {
    try {
      console.log('Updating remark via iframe:', { rowId, remark });
      
      const response = await this.postViaIframe('update_remark', {
        rowId: String(rowId),
        remark: String(remark)
      });
      
      console.log('Update remark response:', response);
      
      return {
        success: true,
        data: { rowId, remark }
      };
    } catch (error) {
      console.error('Update remark error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update remark'
      };
    }
  }

  // Delete lead using iframe POST
  async deleteLead(rowId) {
    try {
      console.log('Deleting lead via iframe:', rowId);
      
      const response = await this.postViaIframe('delete_lead', {
        rowId: String(rowId)
      });
      
      console.log('Delete lead response:', response);
      
      return {
        success: true,
        data: { rowId }
      };
    } catch (error) {
      console.error('Delete lead error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete lead'
      };
    }
  }

  // Replace lead using iframe POST
  async replaceLead(rowId) {
    try {
      console.log('Replacing lead via iframe:', rowId);
      
      const response = await this.postViaIframe('replace_lead', {
        rowId: String(rowId)
      });
      
      console.log('Replace lead response:', response);
      
      return {
        success: true,
        data: { rowId }
      };
    } catch (error) {
      console.error('Replace lead error:', error);
      return {
        success: false,
        error: error.message || 'Failed to replace lead'
      };
    }
  }

  // Delete and replace
  async deleteAndReplaceLead(rowId) {
    try {
      // First delete
      const deleteResult = await this.deleteLead(rowId);
      
      if (!deleteResult.success) {
        return deleteResult;
      }
      
      // Then replace
      const replaceResult = await this.replaceLead(rowId);
      
      return replaceResult;
    } catch (error) {
      console.error('Delete and replace error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete and replace'
      };
    }
  }

  // Initialize leads
  async initializeLeads() {
    try {
      console.log('Initializing leads for user:', this.userName);
      
      const leads = await this.getAllocatedLeads();
      const userLeads = leads.filter(lead => 
        lead.allocate_to && lead.allocate_to === this.userName
      );
      const currentCount = userLeads.length;
      
      console.log(`Current leads for ${this.userName}: ${currentCount}`);
      
      return {
        success: true,
        message: `You have ${currentCount} leads`,
        currentCount
      };
    } catch (error) {
      console.error('Initialize leads error:', error);
      return {
        success: false,
        error: error.message || 'Failed to initialize leads'
      };
    }
  }

  // Get user's allocated leads
  async getUserLeads() {
    try {
      const allLeads = await this.getAllocatedLeads();
      return allLeads.filter(lead => lead.allocate_to === this.userName);
    } catch (error) {
      console.error('Get user leads error:', error);
      return [];
    }
  }
}

export default new GoogleSheetsService();