import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { flyer_slug, referrer, user_agent } = await req.json()

        // Initialize Supabase client
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Log the page view
        const { data: analytics, error: insertError } = await supabaseClient
            .from('flyer_analytics')
            .insert({
                flyer_slug,
                referrer: referrer || 'Direct',
                user_agent,
                notified: false
            })
            .select()
            .single()

        if (insertError) {
            console.error('Error inserting analytics:', insertError)
            throw insertError
        }

        // Send email notification (using Resend or similar service)
        // For now, we'll use a simple webhook or you can integrate Resend API
        const emailData = {
            to: 'scott@ialoans.com',
            subject: '🔔 Someone Viewed Your Flyer!',
            html: `
        <h2>New Flyer View</h2>
        <p>Someone just opened your flyer link:</p>
        <ul>
          <li><strong>Flyer:</strong> ${flyer_slug}</li>
          <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
          <li><strong>Referrer:</strong> ${referrer || 'Direct'}</li>
          <li><strong>Device:</strong> ${user_agent?.substring(0, 100) || 'Unknown'}</li>
        </ul>
        <p><a href="https://mortgage-flyer-pro.vercel.app/analytics">View Analytics Dashboard</a></p>
      `
        }

        // TODO: Integrate with email service (Resend, SendGrid, etc.)
        // For now, just log it
        console.log('Email notification would be sent:', emailData)

        // Mark as notified
        await supabaseClient
            .from('flyer_analytics')
            .update({ notified: true })
            .eq('id', analytics.id)

        return new Response(
            JSON.stringify({ success: true, id: analytics.id }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        )

    } catch (error) {
        console.error('Error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
            }
        )
    }
})
